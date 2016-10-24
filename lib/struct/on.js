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
            if (result !== val) {
              const isFn = typeof result === 'function'
              replace(isFn ? t.fn : t.struct, result, val)
              t[key] = val
            }
            // val === null for struct listenesOn
          } else {
            result = get(t.inherits, key)
            if (result) {
              if (result !== val) {
                const isFn = typeof result === 'function'
                const arr = isFn ? t.fn : t.struct
                if (arr) {
                  replace(arr, result, val)
                } else {
                  if (isFn) {
                    t.fn = copyContext(getFn(t), result, val)
                  } else {
                    t.struct = copyContext(getStruct(t), result, val)
                  }
                }
                // val === null for struct listensOn
                t[key] = val
              }
            } else {
              if (typeof val === 'function') {
                addFn(t, val)
              } else {
                addStruct(t, val)
                // add onListens to struct
              }
              t[key] = val
            }
          }
        }
      }
    }
  }
}

const copyContext = (arr, val, replacement) => {
  const b = []
  if (!replacement) {
    for (let i = 0, j = 0, len = arr.length; i < len; i++) {
      if (arr[i] === val) {
        j = 1
      } else {
        b[i - j] = arr[i]
      }
    }
  } else {
    let i = arr.length
    while (--i) {
      if (arr[i] === val) {
        b[i] = replacement
      } else {
        b[i] = arr[i]
      }
    }
  }
  return b
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
