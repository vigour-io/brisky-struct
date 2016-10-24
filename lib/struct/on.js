const get = (t, key) => t[key] || t.inherits && get(t.inherits, key)
const { getFn, getStruct } = require('../get')

module.exports = {
  instances: false,
  props: {
    default: {
      instances: false,
      props: {
        default: (t, val, key) => {
          var result = key in t && t[key]
          if (result) {
            const arr = typeof result === 'function' ? t.fn : t.struct
            replace(arr, result, val)
            t[key] = val
            // update instances for context ofc
            // prob better to do that on its parent not here
          } else {
            // in context
            result = get(t.inherits, key)
            if (result) {
              console.log('context')
            } else {
              if (typeof val === 'function') {
                addFn(t, val)
              } else {
                addStruct(t, val)
              }
              t[key] = val
            }
          }
        }
      }
    }
  }
}

const replace = (arr, val, replacement) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      if (replacement) {
        arr.splice(i, 1, replacement)
      } else {
        arr.splice(i, 1)
      }
      break
    }
  }
}

const create = (arr, val) => {
  if (arr) {
    let i = arr.length
    const b = []
    b[0] = val
    while (i--) { b[i + 1] = arr[i] }
    return b
  } else {
    return [ val ]
  }
}

const addFn = (t, val) => {
  if (!t.fn) {
    t.fn = create(getFn(t), val)
  } else {
    t.fn.push(val)
  }
}

const addStruct = (t, val) => {
  if (!t.struct) {
    t.struct = create(getStruct(t), val)
  } else {
    t.struct.push(val)
  }
}
