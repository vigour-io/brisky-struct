const { addKey, copy } = require('./keys')
const { data } = require('./emit')

// NEED TO HANDLE REMOVE -- instances need to get killed
const update = (t, val, key, resolved) => {
  if (!(key in t)) {
    if (key !== 'val') {
      // should be handled from the thing getting removed not here
      if (val[key] !== null) {
        if (t._ks) {
          addKey(t, key)
        } else if (!resolved) {
          copy(t)
          return 1
        }
      }
    }
    return true
  }
}

const propertyKeys = (t, val, stamp, changed, resolved) => {
  var j = changed.length
  var inherits
  if (t.instances) {
    while (j--) {
      let key = changed[j]
      let res = update(t, val, key, resolved)
      if (res) {
        if (res !== true) { resolved = res }
        if (!inherits) {
          inherits = [ key ]
        } else {
          inherits.push(key)
        }
      }
    }
    if (inherits) {
      if (stamp) { data(t, val, stamp) }
      propertyChange(t, val, stamp, inherits, resolved)
    }
  } else {
    while (j--) {
      inherits = update(t, val, changed[j], resolved)
      if (inherits === 1) { resolved = inherits }
    }
    if (inherits && stamp) { data(t, val, stamp) }
  }
}

const propertyChange = (t, val, stamp, changed, resolved) => {
  const instances = t.instances
  let i = instances.length
  while (i--) {
    let instance = instances[i]
    propertyKeys(instance, val, stamp, changed, resolved)
  }
}

const valChange = (t, val, stamp, changed) => {
  const instances = t.instances
  let i = instances.length
  while (i--) {
    let instance = instances[i]
    if (instance.val === void 0) {
      if (stamp) { data(instance, val, stamp) }
      if (instance.instances) { valChange(instance, val, stamp, changed) }
    }
  }
}

const instances = (t, val, stamp, changed) => {
  if (changed === true) {
    valChange(t, val, stamp, changed)
  } else {
    // changed 1
    propertyChange(t, val, stamp, changed)
  }
}

module.exports = instances
