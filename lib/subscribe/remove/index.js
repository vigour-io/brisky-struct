const { diff } = require('../diff')
// const removeComposite = require('./composite')
// const isTest = /^\$test/
// var test

const remove = (subs, cb, tree) => {
  const t = tree.$t
  // may remove this and add $remove : no instead
  if (subs.$remove) {
    if (subs.val) { cb(t, 'remove', subs, tree) }
    diff(t, subs, cb, tree, void 0, true)
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
      diff(t, subs, cb, tree, void 0, true)
    }
  }
  // if ('$c' in tree) {
  //   removeComposite(tree, key)
  // }
  delete tree._p[tree._key]
}

// prob dont need to handle composite in there
const removeReference = (subs, cb, tree) => {
  diff(tree.$t, subs, cb, tree, void 0, true)
  if (tree.val) {
    removeReference(subs, cb, tree.val)
  }
  delete tree._p.val
}

exports.remove = remove
exports.removeReference = removeReference

// test = require('../test')
