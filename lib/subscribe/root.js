const { diff } = require('./diff')
const { root } = require('../traversal')

const logger = require('../../test/subscribe/util/log')

module.exports = (t, subs, cb, tree, removed, referenced, previous) => {
  var branch = tree.root
  if (t && !removed) {
    console.log('CREATE ROOT: ->', t.path(), 'ref:', referenced && referenced.path(), 'prev:', previous && previous.path())
    let r = root(t)
    if (!branch) {
      branch = tree.root = { _key: 'root', _p: tree, $t: r }
      createComposite(tree)
    }

    // def not enough
    if (previous && previous === t) {
      console.log('!!!same!!!') // also seems like previous can be opt greatly by just reusing pieces of trees
      previous = r
    }

    return diff(r, subs, cb, branch, void 0, referenced, previous)
  } else if (branch) {
    console.log('REMOVE ROOT: ->')
    console.log(logger(branch), subs)
    // const item = (key, t, subs, cb, tree, removed, referenced, previous) => {
    diff(branch.$t, subs, cb, branch, true, referenced)
    // remove(subs, update, branch, referenced)
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
