const { diff } = require('./diff')
// const removeComposite = require('./composite')
// const isTest = /^\$test/
// var test

const remove = (subs, cb, tree, referenced) => {
  const t = tree.$t
  // may remove this and add $remove : no instead
  if (subs.$remove) {
    if (subs.val) { cb(t, 'remove', subs, tree) }
    diff(t, subs, cb, tree, true, referenced)
  } else {
    // needs to get optmized!!! this is very slow -- need ssomething like .hasTest
    // for (let sub in subs) {
    //   if (sub[0] === '$') {
    //     // needs to be optmized!
    //     // if (isTest.test(sub)) {
    //     //   test(sub, target, subs[sub], update, treeKey, stamp)
    //     // }
    //   }
    // }
    if (subs.val) {
      cb(t, 'remove', subs, tree)
      // subs.val === true (better)
      diff(t, subs, cb, tree, true, referenced)
    }
  }
  // if ('$c' in tree) {
  //   removeComposite(tree, key)
  // }
  delete tree._p[tree._key]
}

// prob dont need to handle composite in there
const reference = (subs, cb, tree, referenced) => {
  diff(tree.$t, subs, cb, tree, true, referenced) // sure about thuis? if !$remove
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
exports.removeComposite = composite
