const { diff } = require('../diff')

const logger = require('../../../test/subscribe/util/log')

const remove = (subs, cb, tree) => {
  const t = tree.$t
  if (subs.val) { cb(t, 'remove', subs, tree) }
    // remove flag can be used (block remove that will be the new thing)
  diff(t, subs, cb, tree, true)
  const key = tree._key

  // console.log('go remove', key, tree._p._key)
  if (tree.$c) { composite(tree._p, key) }
  // console.log(tree._p._key, key)
  if (key === 'parent') {
    // console.log(logger(tree._p._p._p))
  }
  delete tree._p[key]
}

const empty = (obj) => {
  for (let key in obj) {
    return false // hit it
  }
  return true
}

const composite = (tree, key) => {
  var o = tree
  var x
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
            rootClearIt(tree)
          }
          break
        }
      } else {
        break
      }
    } else {
      if (rootClear && tree._key === 'parent') {
        rootClearIt(tree)
      }
      break
    }
  }
}

module.exports = remove

const rootClearIt = (tree) => {
  let t = tree._p
  let xx = 'parent'
  var cnt = 0
  while (t) {
    if (xx === 'root') {
      break
    }
    if (xx === 'parent') {
      cnt++
    } else {
      cnt--
    }
    if (t.$c && t.$c[xx]) {
      if (cnt) {
        t.$c[xx] = 'parent'
        for (var i in t.$c) {
          if (i !== xx) {
            if (t.$c[i] === 'root') {
              t = false
            }
          }
        }
        if (t) {
          xx = t._key
          t = t._p
        }
      } else {
        delete t.$c[xx]
        if (empty(t.$c)) {
          delete t.$c
          xx = t._key
          t = t._p
        } else {
          break
        }
      }
    } else {
      xx = t._key
      t = t._p
    }
  }
}
