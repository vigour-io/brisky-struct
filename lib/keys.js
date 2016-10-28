const removeKey = (t, key) => {
  if (t.keys) {
    const keys = t.keys
    let i = keys.length
    while (--i > -1) {
      if (keys[i] === key) {
        keys.splice(i, 1)
        break
      }
    }
  }
}

const removeContextKey = (t, key) => {
  if (!t.keys) {
    const keys = getKeys(t.inherits)
    if (keys) {
      let i = keys.length
      const b = []
      while (--i > -1) {
        if (keys[i] !== key) { b[i] = keys[i] }
      }
      t.keys = b
    }
  } else {
    removeKey(t, key)
  }
}

const addKey = (t, key) => {
  if (!t.keys) {
    const keys = getKeys(t.inherits)
    if (keys) {
      const len = keys.length
      let i = len
      const b = t.keys = []
      while (--i > -1) { b[i] = keys[i] }
      b[len] = key
    } else {
      t.keys = [ key ]
    }
  } else {
    t.keys.push(key)
  }
}

const getKeys = t => t.keys || t.inherits && getKeys(t.inherits)

exports.removeKey = removeKey
exports.addKey = addKey
exports.removeContextKey = removeContextKey
exports.getKeys = getKeys
