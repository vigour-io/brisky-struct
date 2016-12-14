const { diff } = require('./diff')
const { root } = require('../traversal')
const { getOrigin } = require('../get')

module.exports = (t, subs, cb, tree, removed) => {
  var branch = tree.parent
  if (!removed && t) {
    if (!branch) {
      branch = tree.parent = { _p: tree, _key: 'parent' }
      composite(tree)
    }
    let tx = getParent(t, tree)
    console.log('parent go go go', !!tx)
    return diff(tx, subs, cb, branch)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true)
    return true
  }
}

const get = (t, path) => {
  let i = path.length
  while (i--) {
    if (path[i] === 'root') {
      t = root(t)
    } else {
      t = getOrigin(t, path[i])
    }
  }
  return t
}

const getParent = (t, tree) => {
  var path = []
  var cnt = 1
  var i = 0
  while (tree) {
    if (tree._key) {
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
        path[0] = tree.$keys[path[0]].$t.key
      }
    }
    tree = tree._p
  }
  console.log('go get parent', path, ' need to rewrite numbers ')
  return get(root(t), path)
}

const composite = tree => {
  console.log('composite parent do it now')
  var key = 'parent'
  var parentcounter = 1
  while (tree._p && parentcounter) {
    let tkey = tree._key
    if (tkey !== 'parent') {
      if (parentcounter === 1 && tkey !== 'root') { // && tkey !== '$any'
        if (!tree.$c) { tree.$c = {} }
        if (!(key in tree.$c) || tree.$c[key] !== 'root') {
          tree.$c[key] = 'parent'
        }
      }
      key = tkey
      tree = tree._p
      console.log(key)
      if (key[0] !== '$') {
        parentcounter--
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
}
