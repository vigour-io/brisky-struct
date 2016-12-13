const { diff } = require('../diff')

const remove = (subs, cb, tree) => {
  const t = tree.$t
  if (subs.val) { cb(t, 'remove', subs, tree) }
  if (!subs.$blockRemove) {
    diff(t, subs, cb, tree, true)
  }
  const key = tree._key
  const parent = tree._p
  if (tree.$c) { composite(parent, key) } // will this work?
  if (parent.$keys) {
    // make a fast splice
    // console.log('-----', key, parent.$keys[key])
    // console.log(parent.$keys.map(val => val._key))
    // make this faster....
    parent.$keys.splice(key, 1)
    let i = parent.$keys.length - key
    // can become a lot faster -- maybe we can even ignore the _key field alltogether?
    // lets try it
    while (i--) {
      parent.$keys[i]._key = i
    }
    // need to map all keys...
  } else {
    delete parent[key]
  }
}

const empty = (obj) => {
  for (let key in obj) {
    return false
  }
  return true
}

const composite = (tree, key) => {
  var rootClear
  while (tree) {
    if (tree.$c) {
      if (tree.$c[key]) {
        if (tree.$c[key] === 'root') { rootClear = true }
        delete tree.$c[key]
        if (empty(tree.$c)) {
          delete tree.$c
          key = tree._key
          tree = tree._p
        } else {
          if (rootClear) {
            let block
            for (let i in tree.$c) {
              if (tree.$c[i] === 'root') {
                block = true
                break
              }
            }
            if (!block) { clearRootComposite(tree) }
          }
          break
        }
      }
    } else {
      if (rootClear && tree._key === 'parent') {
        clearRootComposite(tree)
      }
      break
    }
  }
}

const clearRootComposite = (tree) => {
  tree = tree._p
  var key = 'parent'
  var cnt = 0
  while (tree) {
    if (key === 'root') {
      break
    } else {
      if (key === 'parent') {
        cnt++
      } else if (key[0] !== '$') {
        cnt--
      }
      if (tree.$c && tree.$c[key]) {
        if (cnt > 0) {
          tree.$c[key] = 'parent'
          for (var i in tree.$c) {
            if (i !== key) {
              if (tree.$c[i] === 'root') {
                tree = false
              }
            }
          }
          if (tree) {
            key = tree._key
            tree = tree._p
          }
        } else {
          delete tree.$c[key]
          if (empty(tree.$c)) {
            delete tree.$c
            key = tree._key
            tree = tree._p
          } else {
            break
          }
        }
      } else {
        key = tree._key
        tree = tree._p
      }
    }
  }
}

module.exports = remove
