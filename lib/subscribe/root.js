const { diff } = require('./diff')
const { root } = require('../traversal')

module.exports = (t, subs, cb, tree, removed) => {
  var branch = tree.root
  if (t && !removed) {
    if (!branch) {
      branch = tree.root = { _key: 'root', _p: tree }
      composite(tree)
    }
    return diff(root(t), subs, cb, branch)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true)
    return true
  }
}

const composite = tree => {
  var key = 'root'
  while (
    tree._p &&
    (!(tree.$c) ||
    !(key in tree.$c) ||
    tree.$c[key] !== 'root')
  ) {
    let tkey = tree._key
    if (tkey !== 'parent' && tkey !== 'root') { // && tkey !== '$any'
      if (!('$c' in tree)) { tree.$c = {} }
      tree.$c[key] = 'root'
    }
    key = tkey
    tree = tree._p
  }
}
