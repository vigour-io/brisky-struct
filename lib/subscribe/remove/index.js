const { diff } = require('../diff')
// const removeComposite = require('./composite')
// const isTest = /^\$test/
// var test

const remove = (subs, cb, tree, previous) => {
  const t = tree.$t
  if (subs.$remove) {
    if (subs.val) { cb(t, 'remove', subs, tree) }
    diff(t, subs, cb, tree, void 0, true, previous)
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
      diff(t, subs, cb, tree, void 0, true, previous)
    }
  }
  // if ('$c' in tree) {
  //   removeComposite(tree, key)
  // }
  delete tree._p[tree._key]
}

const removeReference = (subs, cb, tree, referenced, previous) => {
  // if (subs.$remove || subs.val || subs.$any) {
  diff(tree.$t, subs, cb, tree, referenced, true, previous)
  // }
  // if ('$c' in tree) {
  //   removeComposite(tree, key)
  // }
  delete tree._p.val
}

exports.remove = remove
exports.removeReference = removeReference

// test = require('../test')
