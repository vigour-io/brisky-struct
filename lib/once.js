const { set } = require('./manipulate')
const { compute } = require('./compute')
var uid = 0

module.exports = (t, check, callback) => {
  var id = 'O' + ++uid
  if (!callback) {
    let promise
    if (check === void 0) {
      promise = new Promise(resolve => on(t, id, (t, val, stamp) => {
        resolve(t, val, stamp)
        return true
      }))
    } else {
      promise = new Promise(resolve => {
        if (!evaluate(resolve, check, t)) {
          on(t, id, (t, val, stamp) => evaluate(resolve, check, t, val, stamp))
        }
      })
    }
    return promise
  } else {
    if (check === void 0) {
      on(t, id, (t, val, stamp) => {
        callback(t, val, stamp)
        return true
      })
    } else {
      if (!evaluate(callback, check, t)) {
        on(t, id, (t, val, stamp) => evaluate(callback, check, t, val, stamp))
      }
    }
    return id
  }
}

const evaluate = (resolve, check, t, val, stamp) => {
  if (typeof check === 'function'
      ? check(t, val, stamp)
      : compute(t) == check //eslint-disable-line
    ) {
    resolve(t, val, stamp)
    return true
  }
}

const on = (t, id, listener) => {
  const context = set(t, {
    on: {
      data: {
        [id]: (t, val, stamp) => {
          if (listener(t, val, stamp)) {
            set(t, { on: { data: { [id]: null } } })
          }
        }
      }
    }
  })
  if (context && context.inherits) { t = context }
  return t
}
