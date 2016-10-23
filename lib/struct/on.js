const get = (t, key) => t[key] || t.inherits && get(t.inherits, key)
const getFn = t => t.fn || t.inherits && getFn(t.inherits)

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
              addFn(t, val)
              // just index maybe better
              t[key] = val // make a ref or something
            }
          }
        }
      }
    }
  }
}

// const removeFn = (t, key) => {
//   if (t.keys) {
//     for (let i = 0; i < t.keys.length; i++) {
//       if (t.keys[i] === key) {
//         t.keys.splice(i, 1)
//         break
//       }
//     }
//   }
// }

// const removeContextFn = (t, key) => {
//   if (!t.keys) {
//     const keys = getKeys(t)
//     if (keys) {
//       let i = keys.length
//       const b = []
//       while (i--) {
//         if (keys[i] !== key) { b[i] = keys[i] }
//       }
//       t.keys = b
//     }
//   } else {
//     removeKey(t, key)
//   }
// }

// do better order (later), may need to add more
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
