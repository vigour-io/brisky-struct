const { diff } = require('./diff')
const { root, parent } = require('../traversal')
const { getOrigin } = require('../get')

module.exports = (t, subs, cb, tree, removed) => {
  var branch = tree.parent
  if (!removed && t) {
    const p = getParent(t, tree)
    if (!branch) {
      branch = tree.parent = { _p: tree, _key: 'parent', $t: p }
      composite(tree)
    }

    // console.log('GO PARENT', p && p.path(), subs)

    if (p !== branch.$t) {
      // solve this....
      console.log('switched parent be carefull try to avoid all this stuff (too much lookup)')
      branch.$t = p
    }

    return diff(p, subs, cb, branch)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true)
    return true
  }
}

const get = (t, path) => {
  for (let i = 0, len = path.length; t && i < len; i++) {
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
  var cnt = 0
  while (tree) {
    if (tree._key && tree._key[0] !== '$') {
      if (tree._key === 'parent') {
        cnt++
      } else {
        if (cnt) {
          cnt--
        } else {
          path.unshift(tree._key)
        }
      }
    }
    tree = tree._p
  }
  path.pop()
  return (!path.length) ? root(t) : get(root(t), path)
}

const composite = (tree) => {
  var key = 'parent'
  var parentcounter = 1
  while (tree._p && parentcounter) {
    let tkey = tree._key
    if (tkey !== 'parent') {
      if (parentcounter === 1 && tkey !== 'root') {
        if (!tree.$c) { tree.$c = {} }
        if (!(key in tree.$c) || tree.$c[key] !== 'root') {
          tree.$c[key] = 'parent'
        } else {
          console.log('!!!!BETTER ACT UP!!!!')
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
