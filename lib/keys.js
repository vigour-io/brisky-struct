const removeKey = (t, key) => {
  if (t.keys) {
    for (let i = 0; i < t.keys.length; i++) {
      if (t.keys[i] === key) {
        t.keys.splice(i, 1)
        break
      }
    }
  }
}

const removeContextKey = (t, key) => {
  if (!t.keys) {
    const keys = getKeys(t)
    if (keys) {
      let i = keys.length
      const b = []
      while (i--) {
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
    const keys = getKeys(t)
    if (keys) {
      let i = keys.length
      const b = []
      b[i] = key
      while (i--) { b[i] = keys[i] }
      t.keys = b
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