const bstamp = require('brisky-stamp')
var set

const isGeneratorFunction = obj => {
  const constructor = obj.constructor
  return constructor && (constructor.name === 'GeneratorFunction' ||
    constructor.displayName === 'GeneratorFunction') ||
    isIterator(constructor.prototype)
}

const generator = (t, val, stamp) => iterator(t, val(t, stamp), stamp)

const iterator = (t, iteratee, stamp, val) => {
  if (!val || !val.done) {
    if (val !== void 0) {
      if (val.value && typeof val === 'object' && typeof val.value.then === 'function') {
        val.value.then((resolved) => {
          console.log('haha', resolved)
          iteratee(iteratee, iteratee.next())
        }).catch(err => {
          console.log('ERROR!!! emit to top', err)
        })
      } else {
        console.log('haha normal')
        iteratee(t, iteratee, stamp, iteratee.next())
      }
    } else {
      iteratee(t, iteratee, stamp, iteratee.next())
    }
  }
}

const promise = (t, val, stamp) => {
  t.val = val // think this is a good idea
  val.then(val => {
    if (stamp) {
      stamp = bstamp.create(bstamp.type(stamp), bstamp.src(stamp))
      set(t, val, stamp)
      bstamp.close(stamp)
    } else {
      set(t, val)
    }
  }).catch(err => {
    console.log('ERROR!!! emit to top', err)
  })
}

exports.isGeneratorFunction = isGeneratorFunction
exports.promise = promise
exports.generator = generator
exports.iterator = iterator

set = require('./manipulate').set

// Symbol.iterator define these when your at it
// once will become a promise, same as is
