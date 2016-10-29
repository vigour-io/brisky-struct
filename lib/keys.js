const removeKey = (t, key) => {
  if (t.keys) {
    const keys = t.keys
    let i = keys.length
    while (i--) {
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
      const b = []
      for (let i = 0, j = 0, len = keys.length; i < len; i++) {
        if (keys[i] === key) {
          j = 1
        } else {
          b[i - j] = keys[i]
        }
      }
      t.keys = b
    }
  } else {
    removeKey(t, key)
  }
}

const copy = t => {
  const keys = getKeys(t.inherits)
  if (keys) {
    const len = keys.length
    let i = len
    const b = t.keys = []
    while (i--) { b[i] = keys[i] }
    return len
  }
}

const addKey = (t, key) => {
  if (!t.keys) {
    const keys = getKeys(t.inherits)
    if (keys) {
      const len = keys.length
      let i = len
      const b = t.keys = []
      while (i--) { b[i] = keys[i] }
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
exports.getKeys = getKeys // add this to get perhaps
exports.copy = copy
