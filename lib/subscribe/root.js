const { diff } = require('./diff')
const { remove } = require('./remove')
const { root } = require('../traversal')

module.exports = (t, subs, update, tree, removed) => {
  var branch = tree.root
  if (t && !removed) {
    if (!branch) {
      branch = tree.root = { _key: 'root', _p: tree }
      createComposite(tree)
    }
    console.log(root(t), subs)
    return diff(root(t), subs, update, branch)
  } else if (branch) {
    remove(subs, update, branch)
    return true
  }
}

function createComposite (tree) {
  var key = 'root'
  while (
    tree._p &&
    (!(tree.$c) ||
    !(key in tree.$c) ||
    tree.$c[key] !== 'root')  // is this good when combined /w parent ??? also need to opt the parent stuff while were at it
  ) {
    if (!('$c' in tree)) { tree.$c = {} }
    tree.$c[key] = 'root' // cannot be good when combined
    key = tree._key
    tree = tree._p
  }
}
