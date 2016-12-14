const { diff } = require('./diff')
const { root } = require('../traversal')

module.exports = (t, subs, cb, tree, removed) => {
  var branch = tree.root
  if (t && !removed) {
    console.log('ROOT IT NOW', tree._key)

    if (!branch) {
      console.log(' \n make it root')
      branch = tree.root = { _key: 'root', _p: tree }
      composite(tree)
    }
    return diff(root(t), subs, cb, branch)
  } else if (branch) {
    console.log('remove')
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
    console.log('???', key)
    let tkey = tree._key
    if (tkey !== 'parent' && tkey !== 'root') {
      console.log('???????????')
      if (!('$c' in tree)) { tree.$c = {} }
      tree.$c[key] = 'root'
    }
    key = tkey
    tree = tree._p
  }
}
