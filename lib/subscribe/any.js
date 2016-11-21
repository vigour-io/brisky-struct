'use strict'
const property = require('./property')
const { getKeys } = require('../keys')
const { get } = require('../get')

module.exports = (t, subs, cb, tree, removed) => {
  if (removed || !t) {
    if (tree.$any) {
      removeFields(t, subs, cb, tree)
      return true
    }
  } else {
    const keys = getKeys(t)
    if (keys) {
      if (!tree.$any) {
        create(keys, t, subs, cb, tree)
        return true
      } else {
        return update(keys, t, subs, cb, tree)
      }
    }
  }
}

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
  const $m = new Array(len)
  const branch = tree.$any = { $t: t, _p: tree, _key: '$any', $keys, $m }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    $keys[i] = key
    property(key, t, subs, cb, branch)
    if (branch[key]) {
      $m[i] = branch[key].$c ? false : branch[key].$
    }
  }
}

const single = (key, i, $m, t, subs, cb, branch) => {
  let k = t && get(t, key)
  if ($m[i] !== k.tStamp || 0) {
    if (property(key, t, subs, cb, branch)) {
      $m[i] = branch[key].$c ? false : branch[key].$
      return true
    }
  }
}

const modify = (hot, $keys, $m, t, subs, cb, branch) => {
  for (let i = 0, len = hot.length; i < len - 3; i += 4) {
    let create = hot[i]
    let remove = hot[i + 1]
    if (remove) {
      property(remove, t, subs, cb, branch, true)
      $keys.pop() // measure speed of pop make this faster
      $m.pop()
    }
    if (create) {
      let index = hot[i + 2]
      property(create, t, subs, cb, branch)
      $keys[index] = create
      $m[index] = branch[create].$c ? false : branch[create].$
    }
  }
}

const update = (keys, t, subs, cb, tree) => {
  var hot, changed
  const branch = tree.$any
  const $keys = branch.$keys
  const $m = branch.$m
  const len1 = $keys.length
  const len2 = keys.length
  const len = len1 > len2 ? len1 : len2
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let compare = $keys[i]
    if (key === compare) {
      changed = single(key, i, $m, t, subs, cb, branch)
    } else {
      let mem = $m[i]
      if (!hot) {
        hot = [ key, compare, i, mem ]
      } else {
        let j = hot.length
        let block
        while (!block && (j -= 4) > -1) {
          if (key !== void 0 && hot[j + 1] === key) {
            $keys[i] = key
            $m[i] = hot[j + 3]
            changed = single(key, i, $m, t, subs, cb, branch)
            if (compare === hot[j]) {
              if (compare && $keys[hot[j + 2]] !== compare) {
                $keys[hot[j + 2]] = compare
                $m[hot[j + 2]] = mem
              }
              hot.splice(j, 4)
              block = true
            } else {
              hot[j + 1] = key = void 0
              if (hot[j] === void 0) { hot.splice(j, 4) }
              if (compare === void 0) { block = true }
            }
          } else if (compare !== void 0 && compare === hot[j]) {
            let index = hot[j + 2]
            $keys[index] = compare
            $m[index] = mem
            changed = single(compare, index, $m, t, subs, cb, branch)
            if (key === hot[j + 1]) {
              hot.splice(j, 4)
              block = true
            } else {
              hot[j] = compare = void 0
              if (hot[j + 1] === void 0) { hot.splice(j, 4) }
              if (key === void 0) { block = true }
            }
          }
        }
        if (!block) { hot.push(key, compare, i, mem) }
      }
    }
  }
  if (hot) {
    modify(hot, $keys, $m, t, subs, cb, branch)
    changed = true
  }
  return changed
}
