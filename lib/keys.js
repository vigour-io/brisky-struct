const { get } = require('./get')

const removeKey = (target, key) => {
  if (target.keys) {
    for (let i = 0; i < target.keys.length; i++) {
      if (target.keys[i] === key) {
        target.keys.splice(i, 1)
        break
      }
    }
  }
  // UPDATE KEY INSTANCES
}

const removeContextKey = (target, key) => {
  if (!target.keys) {
    const keys = get(target.inherits, 'keys', true)
    if (keys) {
      let i = keys.length
      const b = []
      while (i--) {
        if (keys[i] !== key) { b[i] = keys[i] }
      }
      target.keys = b
    }
  } else {
    removeKey(target, key)
  }
}

const addKey = (target, key) => {
  if (!target.keys) {
    const keys = get(target.inherits, 'keys', true)
    if (keys) {
      let i = keys.length
      const b = []
      b[i] = key
      while (i--) { b[i] = keys[i] }
      target.keys = b
    } else {
      target.keys = [ key ]
    }
  } else {
    target.keys.push(key)
  }
  // UPDATE KEY INSTANCES
}

exports.removeKey = removeKey
exports.addKey = addKey
exports.removeContextKey = removeContextKey
