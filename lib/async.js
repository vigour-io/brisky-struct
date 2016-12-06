const bs = require('brisky-stamp')
const { generic } = require('./emit')
const { root } = require('./traversal')
var uid = 0
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

const error = (t, err, stamp) => generic(root(t), 'error', err, stamp)

const isGeneratorFunction = obj => {
  const constructor = obj.constructor
  return constructor && (constructor.name === 'GeneratorFunction' ||
    constructor.displayName === 'GeneratorFunction') ||
    typeof constructor.prototype.next === 'function'
}

const generator = (t, val, stamp) => iterator(t, val(t, stamp), stamp)

const promiseQueue = (t, uid, val, error) => {
  if (t.async) {
    for (let i = 0, end = t.async.length - 2; i < end; i += 3) {
      if (t.async[i + 2] === uid) {
        t.async[i] = val
        t.async[i + 2] = void 0
        if (i === 0) { execPromise(t) }
        break
      }
    }
  }
}

const done = t => {
  t.async.splice(0, 3)
  if (t.async.length) { queue(t) }
  if (t.async && !t.async.length) {
    delete t.async
  }
}

const queue = t => {
  const async = t.async[0]
  if (async && async.next) {
    execIterator(t, async, t.async[1], t.async[2], done)
  } else if (!t.async[2]) {
    execPromise(t)
  }
}

const execPromise = t => {
  const async = t.async[0]
  if (async !== void 0) {
    if (Array.isArray(async)) {
      for (let i = 0, len = async.length; i < len; i++) {
        extendSet(t, async[i], t.async[1])
      }
    } else {
      extendSet(t, async, t.async[1])
    }
  }
  done(t)
}

const next = (iteratee, t, stamp, val) => {
  try {
    return iteratee.next()
  } catch (err) {
    error(t, err, stamp)
    done(t)
  }
}

const execIterator = (t, iteratee, stamp, id, done, val) => {
  if (t.async && t.async[2] === id) {
    if (!val || !val.done) {
      if (val !== void 0) {
        if (
          val.value &&
          typeof val.value === 'object' &&
          typeof val.value.then === 'function'
        ) {
          val.value.then((resolved) => {
            if (t.async && t.async[2] === id) {
              extendSet(t, resolved, stamp)
              execIterator(t, iteratee, stamp, id, done, next(iteratee, t, stamp))
            }
          })
        } else {
          extendSet(t, val.value, stamp)
          execIterator(t, iteratee, stamp, id, done, next(iteratee, t, stamp))
        }
      } else {
        execIterator(t, iteratee, stamp, id, done, next(iteratee, t, stamp))
      }
    } else if (val.done) {
      done(t)
    }
  }
}

const iterator = (t, iteratee, stamp, val) => {
  const id = ++uid
  if (!t.async) {
    t.async = [ iteratee, stamp, id ]
    queue(t)
  } else {
    t.async.push(iteratee, stamp, id)
  }
}

const promise = (t, promise, stamp) => {
  const id = ++uid
  if (!t.async) {
    t.async = [ void 0, stamp, id ]
    queue(t)
  } else {
    t.async.push(void 0, stamp, id)
  }
  promise
    .then(val => promiseQueue(t, id, val))
    .catch(err => {
      error(t, err, stamp)
      promiseQueue(t, id, void 0, err)
    })
}

exports.isGeneratorFunction = isGeneratorFunction
exports.promise = promise
exports.generator = generator
exports.iterator = iterator

set = require('./manipulate').set
