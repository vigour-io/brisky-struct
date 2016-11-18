const { diff } = require('../diff')
// const removeComposite = require('./composite')
// const isTest = /^\$test/
// var test

module.exports = (key, subs, cb, tree, referenced) => {
  if (subs.$remove) {
    diff(tree.$t, subs, cb, tree, referenced, true)
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
  }

  if (subs.val) {
    if (key !== 'val') { cb(tree.$t, 'remove', subs, tree) }
    diff(tree.$t, subs, cb, tree, referenced, true)
  }

  // if ('$c' in tree) {
  //   removeComposite(tree, key)
  // }
  console.log('DELETE', key)
  delete tree._p[key]
}

// test = require('../test')
