const removeKey = (t, key) => {
  if (t._ks) {
    const keys = t._ks
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
  if (!t._ks) {
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
      t._ks = b
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
    const b = t._ks = []
    while (i--) { b[i] = keys[i] }
    return len
  }
}

const addKey = (t, key) => {
  if (!t._ks) {
    const keys = getKeys(t.inherits)
    if (keys) {
      const len = keys.length
      let i = len
      const b = t._ks = []
      while (i--) { b[i] = keys[i] }
      b[len] = key
    } else {
      t._ks = [ key ]
    }
  } else {
    t._ks.push(key)
  }
}

const getKeys = t => t._ks || t.inherits && getKeys(t.inherits)

export { removeKey, addKey, removeContextKey, getKeys, copy }
