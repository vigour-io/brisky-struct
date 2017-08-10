import { diff } from '../diff'
import { correctContext } from '../../context'

const remove = (subs, cb, tree, oRoot) => {
  var t = tree.$t

  // if (tree.$tc) {
  //   if (tree.$stored) {
  //     tree.$stored.unshift(tree.$tc, tree.$tcl || 1)
  //     applyContext(t, tree.$stored)
  //   } else {
  //     applyContext(t, [ tree.$tc, tree.$tcl ])
  //   }
  // }

  if (subs.val) {
    t = correctContext(t, oRoot)
    cb(t, 'remove', subs, tree)
  }
  if (!subs.$blockRemove) {
    diff(t, subs, cb, tree, true, void 0, oRoot)
  }
  const key = tree._key
  const parent = tree._p
  if (parent.$keys) {
    if (Array.isArray(parent.$keys)) {
      parent.$keys.splice(key, 1)
      const len = parent.$keys.length
      let i = len
      if (tree.$c) {
        while (i-- > key) {
          parent.$keys[i]._key = i
        }
        if (parent.$c[len]) {
          composite(parent, len)
        }
      } else {
        while (i-- > key) {
          parent.$keys[i]._key = i
        }
      }
    } else {
      if (tree.$c && parent.$c[key]) { composite(parent, key) }
      delete parent.$keys[key]
    }
  } else {
    if (tree.$c) { composite(parent, key) }
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

const clearRootComposite = tree => {
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

export default remove
