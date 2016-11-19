'use strict'
const { item } = require('./diff')
const { getKeys } = require('../keys')
const { get } = require('../get')

// const property = require('./property')
// const remove = require('./remove')

module.exports = (t, subs, cb, tree, referenced, removed, previous) => {
  // null check should never happen anymore...
  if (removed || !t) {
    if (tree.$any) {
      remove()
      // pass removed true here (it is removed)
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

const swap = () => {
  $keys[hot[j + 2]] = key
  $m[hot[j + 2]] = $m[i]
  changed = singleUpdate(key, hot[j + 2], $m, t, subs, cb, branch, referenced, previous)
}

const iterator = (iterate, compare, $keys, $m, len, fn, t, subs, cb, branch, referenced, previous) => {
  var hot, changed
  for (let i = 0; i < len; i++) {
    let key = iterate[i]
    if (key === compare[i]) {
      changed = singleUpdate(key, i, $m, t, subs, cb, branch, referenced, previous)
    } else {
      if (!hot) {
        hot = [ key, compare[i], i ]
      } else {
        let j = hot.length
        let block
        while (!block && (j -= 3) > -1) {
          if (hot[j] === key) {
            if (compare[i] === hot[j + 1]) {
              hot.splice(j, 3)
              block = true
            } else {
              hot[j] = key = void 0
              if (hot[j + 1] === void 0) { hot.splice(j, 3) }
              if (compare[i] === void 0) { block = true }
            }
          } else if (hot[j + 1] === key) {
            if (compare[i] === hot[j]) {
              hot.splice(j, 3)
              block = true
            } else {
              hot[j + 1] = key = void 0
              if (hot[j] === void 0) { hot.splice(j, 3) }
              if (compare[i] === void 0) { block = true }
            }
          } else if (compare[i] === hot[j]) {
            if (key === hot[j + 1]) {
              hot.splice(j, 3)
              block = true
            } else {
              hot[j] = compare[i] = void 0
              if (hot[j + 1] === void 0) { hot.splice(j, 3) }
              if (key === void 0) { block = true }
            }
          } else if (compare[i] === hot[j + 1]) {
            if (key === hot[j]) {
              hot.splice(j, 3)
              block = true
            } else {
              hot[j + 1] = compare[i] = void 0
              if (hot[j] === void 0) { hot.splice(j, 3) }
              if (key === void 0) { block = true }
            }
          }
        }
        if (!block) { hot.push(key, compare[i], i) }  // do faster
      }
    }
  }

  if (hot) {
    console.log('hot result', hot)
    changed = true
    fn(hot, $keys, $m, t, subs, cb, branch, referenced, previous)
  }

  return changed
}

const pop = (hot, $keys, $m, t, subs, cb, branch, referenced, previous) => {
  for (let i = 0, len = hot.length; i < len - 2; i += 3) {
    item(hot[i][0], t, subs, cb, branch, referenced, true, previous)
    $keys.pop() // measure speed of pop make this faster
    $m.pop()
  }
}

// const push = () => {
//   // you know how many have to be added
//   for (let i = 0, len = hot.length; i < len - 2; i += 3) {
//     let key = hot[i]
//     $keys[hot[i + 2]] = key
//     item(key, t, subs, cb, branch, referenced, void 0, previous)
//     $m[hot[i + 2]] = branch[key].$
//     changed = true
//   }
// }

const update = (keys, t, subs, cb, tree, referenced, previous) => {
  const branch = tree.$any
  const $keys = branch.$keys
  const $m = branch.$m
  var len1 = $keys.length
  var len2 = keys.length
  if (len1 > len2) {
    console.log('$keys is larger', t.path())
    iterator($keys, keys, $keys, $m, len1, pop, t, subs, cb, branch, referenced, previous)
  } else {
    iterator(keys, $keys, $keys, $m, len2, () => {}, t, subs, cb, branch, referenced, previous)
  }
}
