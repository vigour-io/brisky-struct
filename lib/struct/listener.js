import { getFn } from '../get'

const get = (t, key) => t[key] || t.inherits && get(t.inherits, key)

const listener = (t, val, key, stamp) => {
  if (key in t) {
    const result = t[key]
    if (result) {
      if (result !== val) {
        const isFn = typeof result === 'function'
        replace(isFn ? t.fn : t.struct, result, val)
        if (val === null) {
          t[key] = null
        } else {
          t[key] = val
        }
      }
    } else { //  if (val !== null)
      add(t, val, key)
    }
  } else {
    const result = get(t.inherits, key)
    if (result && typeof result === 'function') {
      if (result !== val) {
        if (t.fn) {
          replace(t.fn, result, val)
        } else {
          t.fn = copyContext(getFn(t), result, val)
        }
        t[key] = val
      }
    } else {
      add(t, val, key)
    }
  }
}

const add = (t, val, key) => {
  if (typeof val === 'function') {
    addFn(t, val)
  } else {
    addStruct(t, val)
  }
  t[key] = val
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
    while (i--) {
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
  for (let i = 0, len = arr.length; i < len; i++) {
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
    const b = [ val ]
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
    t.fn.unshift(val)
  }
}

const addStruct = (t, val) => {
  if (!t.struct) {
    t.struct = [ val ]
  } else {
    t.struct.unshift(val)
  }
}

export { addFn, listener, replace }
