import { diff } from './diff'
import { root } from '../traversal'
import { getOrigin } from '../get'

export default (t, subs, cb, tree, removed, oRoot) => {
  var branch = tree.parent
  if (!removed && t) {
    if (!branch) {
      branch = tree.parent = { _p: tree, _key: 'parent' }
      composite(tree)
    }
    const parent = getParent(t, tree, oRoot)
    const c = diff(parent, subs, cb, branch, void 0, void 0, oRoot)
    return c
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true, void 0, oRoot)
    return true
  }
}

const get = (t, path, oRoot) => {
  let i = path.length
  while (i--) {
    if (path[i] === 'root') {
      t = root(t)
    } else {
      // this is dangerous in context!
      t = getOrigin(t, path[i]) // special get origin that handles context and corrects
    }
  }
  return t
}

const getParent = (t, tree, oRoot) => {
  var path = []
  var cnt = 1
  var i = 0
  while (tree) {
    if (tree._key !== void 0) {
      if (tree._key[0] !== '$') {
        if (tree._key === 'parent') {
          cnt++
        } else {
          if (cnt) {
            cnt--
          } else {
            path[i++] = tree._key
          }
        }
      } else if (tree._key.indexOf('any') === 1 && path.length) {
        // refactor this a little but later
        path[0] = tree.$keys[path[0]] ? tree.$keys[path[0]].$t.key : path[0]
      }
    }
    tree = tree._p
  }
  return get(root(t), path, oRoot)
}

const composite = tree => {
  var key = 'parent'
  var parentcounter = 1
  while (tree._p && parentcounter) {
    let tkey = tree._key
    if (tkey !== 'parent') {
      if (parentcounter === 1 && tkey !== 'root') {
        if (!tree.$c) { tree.$c = {} }
        if (!(key in tree.$c) || tree.$c[key] !== 'root') {
          tree.$c[key] = 'parent'
        }
      }
      key = tkey
      tree = tree._p
      if (key[0] !== '$') {
        parentcounter--
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
}
