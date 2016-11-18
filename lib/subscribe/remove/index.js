const { diff } = require('../diff')
// const removeComposite = require('./composite')
// const isTest = /^\$test/
// var test

const remove = (subs, cb, tree) => {
  if (subs.$remove) {
    if (subs.val) { cb(tree.$t, 'remove', subs, tree) }
    diff(tree.$t, subs, cb, tree, void 0, true)
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
      cb(tree.$t, 'remove', subs, tree)
      diff(tree.$t, subs, cb, tree, void 0, true)
    }
  }
  // if ('$c' in tree) {
  //   removeComposite(tree, key)
  // }
  delete tree._p[tree._key]
}

const removeReference = (subs, cb, tree, referenced) => {
  if (subs.$remove || subs.val) {
    diff(tree.$t, subs, cb, tree, referenced, true)
  }
  // if ('$c' in tree) {
  //   removeComposite(tree, key)
  // }
  delete tree._p.val
}

exports.remove = remove
exports.removeReference = removeReference

// test = require('../test')
