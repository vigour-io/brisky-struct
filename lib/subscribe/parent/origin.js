const { diff } = require('../diff')
const { parent } = require('../../traversal')

module.exports = (t, subs, cb, tree, removed) => {
  var branch = tree.parent
  if (!removed && t) {
    const p = parent(t)

    if (!branch) {
      // context issues defintly
      branch = tree.parent = { _p: tree, _key: 'parent', $t: p }
      composite(tree, 'parent')
    }

    if (p !== branch.$t) {
      console.log('switched parent be carefull try to avoid all this stuff (too much lookup)')
      branch.$t = p
    }

    return diff(p, subs, cb, branch)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true)
    return true
  }
}

const composite = (tree, type) => {
  var key = type
  while (tree._p) {
    if (tree._key !== type) {
      if (!tree.$c) { tree.$c = {} }
      tree.$c[key] = type
      key = tree._key
      tree = tree._p
    } else {
      tree = tree._p
    }
  }
}
