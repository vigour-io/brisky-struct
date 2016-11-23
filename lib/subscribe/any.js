'use strict'
const { property } = require('./property')
const { getKeys } = require('../keys')

const inherits = (key, t, index) => {
  var i = 0
  while (i < index && t && typeof t === 'object' && t.inherits) {
    i++
    if (key in t) {
      return false
    }
    t = t.val
  }
  return true
}

// reintroduce $m whenever it feels like its going to help
const parseKeys = (t) => {
  var keys = getKeys(t)
  var orig = t
  t = t.val
  if (t && typeof t === 'object' && t.inherits) {
    let combined
    let index = 1
    while (t && typeof t === 'object' && t.inherits) {
      let k = getKeys(t)
      let kl = k && k.length
      if (kl) {
        if (!combined) {
          if (keys) {
            combined = []
            for (let j = 0, len = keys.length; j < len; j++) {
              combined[j] = keys[j]
            }
            for (let i = 0; i < kl; i++) {
              if (inherits(k[i], orig, index)) {
                combined.push(k[i])
              }
            }
          } else {
            keys = k
          }
        } else {
          for (let i = 0; i < kl; i++) {
            if (inherits(k[i], orig, index)) {
              combined.push(k[i])
            }
          }
        }
      }
      index++
      t = t.val
    }
    return combined || keys
  }
  return keys
}

const any = (t, subs, cb, tree, removed) => {
  if (removed || !t) {
    if (tree.$any) {
      removeFields(t, subs, cb, tree)
      return true
    }
  } else {
    const keys = parseKeys(t)
    if (keys) {
      if (!tree.$any) {
        create(keys, t, subs, cb, tree)
        return true
      } else {
        return update(keys, t, subs, cb, tree)
      }
    } else if (tree.$any) {
      removeFields(t, subs, cb, tree)
      return true
    }
  }
}

module.exports = any

const removeFields = (t, subs, cb, tree) => {
  const branch = tree.$any
  const $keys = branch.$keys
  const len = $keys.length
  for (let i = 0; i < len; i++) {
    property($keys[i], t, subs, cb, branch, true)
  }
  delete tree.$any
}

const create = (keys, t, subs, cb, tree) => {
  const len = keys.length
  const $keys = new Array(len)
  const branch = tree.$any = { _p: tree, _key: '$any', $keys }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    $keys[i] = key
    property(key, t, subs, cb, branch)
  }
}

const modify = (hot, $keys, t, subs, cb, branch) => {
  for (let i = 0, len = hot.length; i < len - 2; i += 3) {
    let create = hot[i]
    let remove = hot[i + 1]
    if (remove) {
      property(remove, t, subs, cb, branch, true)
      $keys.pop() // measure speed of pop make this faster
    }
    if (create) {
      let index = hot[i + 2]
      property(create, t, subs, cb, branch)
      $keys[index] = create
    }
  }
}

const update = (keys, t, subs, cb, tree) => {
  var hot, changed
  const branch = tree.$any
  const $keys = branch.$keys
  const len1 = $keys.length
  const len2 = keys.length
  var checks = len1

  const len = len1 > len2 ? len1 : len2
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let compare = $keys[i]
    if (key === compare) {
      checks--
      changed = property(key, t, subs, cb, branch)
    } else {
      if (!hot) {
        hot = [ key, compare, i ]
      } else {
        if (checks) {
          let j = hot.length
          let block
          while (!block && (j -= 3) > -1) {
            if (key !== void 0 && hot[j + 1] === key) {
              $keys[i] = key
              changed = property(key, t, subs, cb, branch)
              if (compare === hot[j]) {
                if (compare && $keys[hot[j + 2]] !== compare) {
                  $keys[hot[j + 2]] = compare
                }
                hot.splice(j, 3)
                block = true
              } else {
                hot[j + 1] = key = void 0
                if (hot[j] === void 0) { hot.splice(j, 3) }
                if (compare === void 0) { block = true }
              }
            } else if (compare !== void 0 && compare === hot[j]) {
              let index = hot[j + 2]
              $keys[index] = compare
              changed = property(compare, t, subs, cb, branch)
              if (key === hot[j + 1]) {
                hot.splice(j, 3)
                block = true
              } else {
                hot[j] = compare = void 0
                if (hot[j + 1] === void 0) { hot.splice(j, 3) }
                if (key === void 0) { block = true }
              }
            }
          }
          if (!block) { hot.push(key, compare, i) }
        } else {
          hot.push(key, void 0, i)
        }
      }
    }
  }
  if (hot) {
    modify(hot, $keys, t, subs, cb, branch)
    changed = true
  }
  return changed
}
