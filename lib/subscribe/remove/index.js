const { diff } = require('../diff')
// const removeComposite = require('./composite')
// const isTest = /^\$test/
// var test

module.exports = (key, t, subs, cb, tree, force, referenced) => {
  if (subs.$remove) {
    diff(t, subs, cb, tree, force, referenced)
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
    console.log('?xxx')
    cb(t, 'remove', subs, tree)
    diff(t, subs, cb, tree, force, referenced)
  }

  // if ('$c' in tree) {
  //   removeComposite(tree, key)
  // }
  delete tree._p[key]
}

// test = require('../test')
