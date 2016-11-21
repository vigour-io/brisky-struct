const { diff } = require('../diff')

const remove = (subs, cb, tree) => {
  const t = tree.$t
  if (subs.val) { cb(t, 'remove', subs, tree) }
    // remove flag can be used (block remove that will be the new thing)
  diff(t, subs, cb, tree, true)
  const key = tree._key
  if (tree.$c) { composite(tree, key) }
  delete tree._p[key]
}

const empty = (obj) => {
  for (let key in obj) {
    return false
  }
  return true
}

const composite = (tree, key) => {
  while (tree && tree._p && tree.$c && tree.$c[key]) {
    delete tree.$c[key]
    if (empty(tree.$c)) {
      delete tree.$c
      key = tree._key
      tree = tree._p
    } else {
      tree = false
    }
  }
}

module.exports = remove
