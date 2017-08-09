import { diff } from './diff'

export default (t, subs, cb, tree, removed, oRoot) => {
  var branch = tree.root
  if (t && !removed) {
    if (!branch) {
      branch = tree.root = { _key: 'root', _p: tree }
      composite(tree)
    }
    return diff(oRoot, subs, cb, branch, void 0, void 0, oRoot)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true, void 0, oRoot)
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
    if (tkey !== 'parent' && tkey !== 'root') {
      if (!('$c' in tree)) { tree.$c = {} }
      tree.$c[key] = 'root'
    }
    key = tkey
    tree = tree._p
  }
}
