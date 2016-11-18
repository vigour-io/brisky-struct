// 'use strict'
// const isEmpty = require('vigour-util/is/empty')

// module.exports = function removeComposite (tree, key) {
//   while (tree && tree._p && '$c' in tree && tree.$c[key]) {
//     delete tree.$c[key]
//     if (isEmpty(tree.$c)) {
//       delete tree.$c
//       key = tree._key
//       tree = tree._p
//     } else {
//       tree = false
//     }
//   }
// }
