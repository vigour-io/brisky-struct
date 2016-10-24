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
          } else {
            result = get(t.inherits, key)
            if (result) {
              const isFn = typeof result === 'function'
              if (val === null) {
                console.log('remove cntx')
              } else {
                const arr = isFn ? t.fn : t.struct
                if (arr) {
                  console.log(' go go go')
                  replace(arr, result, val)
                } else {
                  if (isFn) {
                    t.fn = copyContext(getFn(t), result, val)
                  } else {
                    t.struct = copyContext(getStruct(t), result, val)
                  }
                }
                t[key] = val
              }
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

const copyContext = (arr, val, replacement) => {
  let i = arr.length
  const b = []
  while (i--) {
    if (arr[i] === val) {
      b[i] = replacement
    } else {
      b[i] = arr[i]
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
