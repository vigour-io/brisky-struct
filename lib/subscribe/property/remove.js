const { diff } = require('../diff')

const logger = require('../../../test/subscribe/util/log')

const remove = (subs, cb, tree) => {
  const t = tree.$t
  if (subs.val) { cb(t, 'remove', subs, tree) }
    // remove flag can be used (block remove that will be the new thing)
  diff(t, subs, cb, tree, true)
  const key = tree._key

  // console.log('go remove', key, tree._p._key)
  if (tree.$c) { composite(tree._p, key) }
  // console.log(tree._p._key, key)
  if (key === 'parent') {
    // console.log(logger(tree._p._p._p))
  }
  delete tree._p[key]
}

const empty = (obj) => {
  for (let key in obj) {
    return false // hit it
  }
  return true
}

const composite = (tree, orig) => {
  var key = orig
  var first
  console.log(orig)


  // while tree walking
  if (tree && tree._p && !(tree.$c && tree.$c[key])) {
    if (tree._key === 'parent') {
      console.log('this is it', orig)
    }
  }

  while (tree && tree._p && tree.$c && tree.$c[key]) {
    if (!first) {
      first = tree.$c[key]
    }

    if (key === 'parent' || key === 'root') {
      if (first === 'root' && key === 'parent') {
        tree.$c[key] = 'parent'
        composite(tree._p, tree._key)
      }
      break
    }
    delete tree.$c[key]
    if (empty(tree.$c)) {
      delete tree.$c
      key = tree._key
      tree = tree._p
    } else {
      tree = false // hit it
    }
  }
}

module.exports = remove
