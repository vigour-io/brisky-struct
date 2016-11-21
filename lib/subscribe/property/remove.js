const { diff } = require('../diff')
// const logger = require('../../../test/subscribe/util/log')

const remove = (subs, cb, tree, referenced) => {
  const t = tree.$t
  // console.log('REMOVE -->', t.path(), logger(tree), referenced && referenced.path())
  if (subs.val) { cb(t, 'remove', subs, tree) }
  diff(t, subs, cb, tree, true, referenced)
  if (tree.val) { remove(subs, cb, tree.val, referenced) }
  const key = tree._key
  if (tree.$c) { composite(tree, key) }
  delete tree._p[key]
}

const reference = (subs, cb, tree, referenced) => {
  diff(tree.$t, subs, cb, tree, true, referenced)
  if (tree.val) {
    reference(subs, cb, tree.val, referenced)
  }
  delete tree._p.val
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

exports.remove = remove
exports.removeReference = reference
