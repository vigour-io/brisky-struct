const { set } = require('./manipulate')
const { compute } = require('./compute')
var uid = 0

module.exports = (t, check) => {
  var promise
  var id = 'O' + ++uid
  if (check === void 0) {
    promise = new Promise(
      resolve => on(t, id, (t, val, stamp) => {
        resolve(t, val, stamp)
        return true
      })
    )
  } else {
    promise = new Promise(resolve => {
      if (!evaluate(resolve, check, t)) {
        on(t, id, (t, val, stamp) => evaluate(resolve, check, t, val, stamp))
      }
    }).catch(e => {
      console.log(e)
    })
  }
  return promise
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
  console.log('????', id, t, t.on.data.fn)

  if (context && context.inherits) { t = context }
  return t
}
