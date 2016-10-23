const get = (t, key) => t[key] || t.inherits && get(t.inherits, key)

module.exports = {
  instances: false,
  props: {
    default: {
      instances: false,
      props: {
        default: (t, val, key) => {
          var result = key in t && t[key]
          if (result) {
              // do some magic
          } else {
            result = get(t.inherits, key) // in context
            if (result) {

            } else {
              if (typeof val === 'function') {
                addFn(t, val)
              } else {
                addStruct(t, val)
              }
              // just index maybe better
              t[key] = val // make a ref or something
            }
          }
        }
      }
    }
  }
}

// do better order (later), may need to add more

const getFn = t => t.fn || t.inherits && getFn(t.inherits)
const addFn = (t, val) => {
  if (!t.fn) {
    const fn = getFn(t)
    if (fn) {
      let i = fn.length
      const b = []
      b[0] = val
      while (i--) { b[i + 1] = fn[i] }
      t.fn = b
    } else {
      t.fn = [ val ]
    }
  } else {
    t.fn.push(val)
  }
}

const getStruct = t => t.struct || t.inherits && getStruct(t.inherits)
const addStruct = (t, val) => {
  if (!t.struct) {
    const struct = getStruct(t)
    if (struct) {
      let i = struct.length
      const b = []
      b[0] = val
      while (i--) { b[i + 1] = struct[i] }
      t.struct = b
    } else {
      t.struct = [ val ]
    }
  } else {
    t.struct.push(val)
  }
}
