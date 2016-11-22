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

    console.log('GO PARENT', p && p.path(), subs)

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
  var key = 'parent'
  var parentcounter = 1

  // var xt = 0
  // var x = []
  // var tt = tree._p
  // while (tt) {
  //   if (tt._key && tt._key[0] !== '$') {
  //     x.unshift(tt._key)
  //   }
  //   tt = tt._p
  // }
  // // console.log(x)

  while (tree._p) {
    if (tree._key !== 'parent') {
      key = tree._key
      tree = tree._p
      if (key === 'root') {
        path.unshift('root')
      } else if (key[0] !== '$') {
        parentcounter--
        if (parentcounter < 0) {
          path.unshift(key)
        }
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }

  // if (x.join('/') !== path.join('/')) {
  //   console.log('hello')
  //   console.log(x.join('/'), 'vs', path.join('/'))
  // }
  // // return get(root(t), x)
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
