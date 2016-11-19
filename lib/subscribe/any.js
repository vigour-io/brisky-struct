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

const singleUpdate = (key, i, $m, t, subs, cb, branch, referenced, previous) => {
  let k = t && get(t, key)
  // composite
  // will recreate stuff from item in here (item prop or something less complex)
  if ($m[i].$ !== (k.tStamp || k.stamp || 0)) {
    if (item(key, t, subs, cb, branch, referenced, void 0, previous)) {
      $m[i] = branch[key].$
      return true
    }
  }
}

const iterator = (keys, $keys, $m, len, t, subs, cb, branch, referenced, previous) => {
  var hot, changed
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let compareKey = $keys[i]
    if (key === compareKey) {
      changed = singleUpdate(key, i, $m, t, subs, cb, branch, referenced, previous)
    } else {
      if (!hot) {
        hot = [ key, compareKey, i ]
      } else {
        let j = hot.length
        let block
        while (!block && (j -= 3) > -1) {
          if (hot[j + 1] === key) {
            // previous new -> old 0 -> 1
            $keys[i] = key
            $m[i] = $m[hot[j + 2]]
            changed = singleUpdate(key, i, $m, t, subs, cb, branch, referenced, previous)
            if (compareKey === hot[j]) {
              hot.splice(j, 3)
              block = true
            } else {
              hot[j + 1] = key = void 0
              if (hot[j] === void 0) { hot.splice(j, 3) }
              if (compareKey === void 0) { block = true }
            }
          } else if (compareKey === hot[j]) {
            // current old -> new 1 -> 0
            let newIndex = hot[j + 2]
            $keys[newIndex] = compareKey
            $m[newIndex] = $m[i]
            changed = singleUpdate(compareKey, newIndex, $m, t, subs, cb, branch, referenced, previous)
            if (key === hot[j + 1]) {
              hot.splice(j, 3)
              block = true
            } else {
              hot[j] = compareKey = void 0
              if (hot[j + 1] === void 0) { hot.splice(j, 3) }
              if (key === void 0) { block = true }
            }
          }
        }
        if (!block) { hot.push(key, compareKey, i) }  // do faster
      }
    }
  }
  if (hot) {
    changed = true
    fn(hot, $keys, $m, t, subs, cb, branch, referenced, previous)
  }
  return changed
}

const fn = (hot, $keys, $m, t, subs, cb, branch, referenced, previous) => {
  for (let i = 0, len = hot.length; i < len - 2; i += 3) {
    console.log('  ', hot[i], hot[i + 1], hot[i + 2])
    let key = hot[i]
    if (!key) {
      item(hot[i + 1], t, subs, cb, branch, referenced, true, previous)
      $keys.pop() // measure speed of pop make this faster
      $m.pop()
    } else {
      let index = hot[i + 2]
      item(key, t, subs, cb, branch, referenced, void 0, previous)
      $keys[index] = key
      $m[index] = branch[key].$
    }
  }
}

const update = (keys, t, subs, cb, tree, referenced, previous) => {
  const branch = tree.$any
  const $keys = branch.$keys
  const $m = branch.$m
  var len1 = $keys.length
  var len2 = keys.length
  console.log(len1 > len2 ? '$keys is larger' : 'default')
  iterator(keys, $keys, $m, len1 > len2 ? len1 : len2, t, subs, cb, branch, referenced, previous)
}
