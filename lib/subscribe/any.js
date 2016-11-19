'use strict'
const { item } = require('./diff')
const { getKeys } = require('../keys')
const { get } = require('../get')

// const property = require('./property')
// const remove = require('./remove')

module.exports = (t, subs, cb, tree, referenced, removed, previous) => {
  if (removed || !t) {
    if (tree.$any) {
      remove()
      return true
    }
  } else {
    const keys = getKeys(t)
    if (keys) {
      if (!tree.$any) {
        create(keys, t, subs, cb, tree, referenced, previous)
        return true
      } else {
        return update(keys, t, subs, cb, tree, referenced, previous)
      }
    }
  }
}

const remove = () => {
  console.log('remove')
}

const create = (keys, t, subs, cb, tree, referenced, previous) => {
  const len = keys.length
  const $keys = new Array(len)
  const $m = new Array(len)
  const branch = tree.$any = { _p: tree, _key: '$any', $keys, $m }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    $keys[i] = key
    item(key, t, subs, cb, branch, referenced, void 0, previous)
    $m[i] = branch[key].$
  }
}

const single = (key, i, $m, t, subs, cb, branch, referenced, previous) => {
  let k = t && get(t, key)
  // composite
  // will recreate stuff from item in here (item prop or something less complex)
  if ($m[i] !== k.tStamp) {
    if (item(key, t, subs, cb, branch, referenced, void 0, previous)) {
      $m[i] = branch[key].$
      return true
    }
  }
}

const modify = (hot, $keys, $m, t, subs, cb, branch, referenced, previous) => {
  for (let i = 0, len = hot.length; i < len - 2; i += 3) {
    // console.log('  hot:', hot[i], hot[i + 1], hot[i + 2])
    let key = hot[i]
    if (!key) {
      // just call remove straight
      item(hot[i + 1], t, subs, cb, branch, referenced, true, previous)
      $keys.pop() // measure speed of pop make this faster
      $m.pop()
    } else {
      let index = hot[i + 2]
      // special "faster" property
      item(key, t, subs, cb, branch, referenced, void 0, previous)
      $keys[index] = key
      $m[index] = branch[key].$
    }
  }
}

const update = (keys, t, subs, cb, tree, referenced, previous) => {
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
      changed = single(key, i, $m, t, subs, cb, branch, referenced, previous)
    } else {
      if (!hot) {
        hot = [ key, compare, i ]
      } else {
        let j = hot.length
        let block
        while (!block && (j -= 3) > -1) {
          if (hot[j + 1] === key) {
            // previous new -> old 0 -> 1
            if (key !== void 0) {
              $keys[i] = key
              $m[i] = $m[hot[j + 2]]
              changed = single(key, i, $m, t, subs, cb, branch, referenced, previous)
            }
            if (compare === hot[j]) {
              hot.splice(j, 3)
              block = true
            } else {
              hot[j + 1] = key = void 0
              if (hot[j] === void 0) { hot.splice(j, 3) }
              if (compare === void 0) { block = true }
            }
          } else if (compare === hot[j]) {
            // current old -> new 1 -> 0
            if (compare !== void 0) {
              let index = hot[j + 2]
              $keys[index] = compare
              $m[index] = $m[i]
              changed = single(compare, index, $m, t, subs, cb, branch, referenced, previous)
            }
            if (key === hot[j + 1]) {
              hot.splice(j, 3) // splice is messed up
              block = true
            } else {
              hot[j] = compare = void 0
              if (hot[j + 1] === void 0) { hot.splice(j, 3) }
              if (key === void 0) { block = true }
            }
          }
        }
        if (!block) { hot.push(key, compare, i) }  // do faster
      }
    }
  }
  if (hot) {
    modify(hot, $keys, $m, t, subs, cb, branch, referenced, previous)
    changed = true
  }
  return changed
}
