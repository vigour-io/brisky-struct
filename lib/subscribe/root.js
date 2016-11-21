const { diff } = require('./diff')
const { root } = require('../traversal')

module.exports = (t, subs, cb, tree, removed) => {
  var branch = tree.root
  if (t && !removed) {
    if (!branch) {
      branch = tree.root = { _key: 'root', _p: tree, $t: root(t) }
      createComposite(tree)
    }
    return diff(branch.$t, subs, cb, branch)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true)
    return true
  }
}

function createComposite (tree) {
  var key = 'root'
  while (
    tree._p &&
    (!(tree.$c) ||
    !(key in tree.$c) ||
    tree.$c[key] !== 'root')
  ) {
    if (!('$c' in tree)) { tree.$c = {} }
    tree.$c[key] = 'root'
    key = tree._key
    tree = tree._p
  }
}
