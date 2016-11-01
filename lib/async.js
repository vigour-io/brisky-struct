const bs = require('brisky-stamp')
const { generic } = require('./emit')
const { root } = require('./traversal')
var set
// clean this up

const extendSet = (t, val, stamp) => {
  if (stamp) {
    stamp = bs.create(bs.type(stamp), bs.src(stamp))
    set(t, val, stamp)
    bs.close(stamp)
  } else {
    set(t, val)
  }
}

const error = (t, err, stamp) => generic(root(t), 'error', err, stamp)

const isGeneratorFunction = obj => {
  const constructor = obj.constructor
  return constructor && (constructor.name === 'GeneratorFunction' ||
    constructor.displayName === 'GeneratorFunction') ||
    typeof constructor.prototype.next === 'function'
}

const generator = (t, val, stamp) => iterator(t, val(t, stamp), stamp)

const promiseQueue = (t, uid, val, error) => {
  for (let i = 0, end = t.async.length - 1; i < end; i += 2) {
    if (t.async[i] === uid) {
      if (i === 0) {
        if (val !== void 0) {
          extendSet(t, val, t.async[i + 1])
        }
        t.async.splice(0, 2)
        if (end > 2) { queue(t) }
      } else {
        t.async[i] = val
      }
      break
    }
  }
}

const queue = t => {
  const async = t.async[0]
  if (async && async.next) {
    execIterator(t, async, t.async[1], void 0, () => {
      t.async.splice(0, 2)
      if (t.async.length) {
        queue(t)
      }
    })
  } else {
    if (typeof async !== 'string' || async.indexOf('async') !== 0) {
      if (async !== void 0) {
        extendSet(t, async, t.async[1])
      }
      t.async.splice(0, 2)
      if (t.async.length) {
        queue(t)
      }
    }
  }
}

const execIterator = (t, iteratee, stamp, val, done) => {
  if (!val || !val.done) {
    if (val !== void 0) {
      if (val.value && typeof val === 'object' && typeof val.value.then === 'function') {
        val.value.then((resolved) => {
          extendSet(t, resolved, stamp)
          execIterator(t, iteratee, stamp, iteratee.next(), done)
        }).catch(err => error(t, err, stamp))
      } else {
        extendSet(t, val.value, stamp)
        execIterator(t, iteratee, stamp, iteratee.next(), done)
      }
    } else {
      execIterator(t, iteratee, stamp, iteratee.next(), done)
    }
  } else if (val.done) {
    done()
  }
}

const iterator = (t, iteratee, stamp, val) => {
  if (!t.async) {
    t.async = [ iteratee, stamp ]
    queue(t)
  } else {
    t.async.push(iteratee, stamp)
  }
}

const promise = (t, promise, stamp) => {
  var uid = 'async' + ((Math.random() * 100000) | 0)
  if (!t.async) {
    t.async = [ uid, stamp ]
    queue(t)
  } else {
    t.async.push(uid, stamp)
  }
  promise.then(val => {
    promiseQueue(t, uid, val)
  }).catch(err => {
    error(t, err, stamp)
    promiseQueue(t, uid, void 0, err)
  })
}

exports.isGeneratorFunction = isGeneratorFunction
exports.promise = promise
exports.generator = generator
exports.iterator = iterator

set = require('./manipulate').set
