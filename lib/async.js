const bs = require('brisky-stamp')
var set

const extendSet = (t, val, stamp) => {
  if (stamp) {
    stamp = bs.create(bs.type(stamp), bs.src(stamp))
    set(t, val, stamp)
    bs.close(stamp)
  } else {
    set(t, val)
  }
}

const error = (t, err, stamp) => {
  console.log('go root and emit error', err)
}

const isGeneratorFunction = obj => {
  const constructor = obj.constructor
  return constructor && (constructor.name === 'GeneratorFunction' ||
    constructor.displayName === 'GeneratorFunction') ||
    typeof constructor.prototype.next === 'function'
}

const generator = (t, val, stamp) => iterator(t, val(t, stamp), stamp)

const iterator = (t, iteratee, stamp, val) => {
  if (!val || !val.done) {
    if (val !== void 0) {
      if (val.value && typeof val === 'object' && typeof val.value.then === 'function') {
        val.value.then((resolved) => {
          extendSet(t, resolved, stamp)
          iterator(t, iteratee, stamp, iteratee.next())
        }).catch(err => error(t, err, stamp))
      } else {
        extendSet(t, val.value, stamp)
        iterator(t, iteratee, stamp, iteratee.next())
      }
    } else {
      iterator(t, iteratee, stamp, iteratee.next())
    }
  }
}

// add field _async

const promise = (t, val, stamp) => {
  val
  .then(val => extendSet(t, val, stamp))
  .catch(err => error(t, err, stamp))
}

exports.isGeneratorFunction = isGeneratorFunction
exports.promise = promise
exports.generator = generator
exports.iterator = iterator

set = require('./manipulate').set

// Symbol.iterator define these when your at it
// once will become a promise, same as is
