const { diff } = require('./diff')
const { root } = require('../traversal')

module.exports = (t, subs, cb, tree, removed, referenced, previous) => {
  var branch = tree.root
  if (t && !removed) {
    let r = root(t)
    if (!branch) {
      branch = tree.root = { _key: 'root', _p: tree, $t: r }
      createComposite(tree)
    }

    // refs on root
    if (previous) { previous = r }
    // this enough since we know it is going to the exact same root again
    return diff(r, subs, cb, branch, void 0, referenced, previous)
  } else if (branch) {
    if (referenced) { referenced = branch.$t } // same here
    diff(branch.$t, subs, cb, branch, true, referenced)
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
