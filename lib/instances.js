const { addKey, removeKey } = require('./keys')
const { data } = require('./emit')

// NEED TO HANDLE REMOVE -- instances need to get killed
const update = (t, val, key) => {
  if (!(key in t)) {
    if (key !== 'val') {
      if (val[key] === null) {
        removeKey(t, key)
      } else {
        addKey(t, key)
      }
    }
    return true
  }
}

const propertyKeys = (t, val, stamp, changed) => {
  var j = changed.length
  var inherits
  if (t.instances) {
    while (j--) {
      let key = changed[j]
      if (update(t, val, key)) {

      }
    }
    if (inherits) {
      if (stamp) { data(t, val, stamp) }
      propertyChange(t, val, stamp, inherits)
    }
  } else {
    while (j--) { inherits = update(t, val, changed[j]) }
    if (inherits && stamp) { data(t, val, stamp) }
  }
}

const propertyChange = (t, val, stamp, changed) => {
  const instances = t.instances
  let i = instances.length
  while (i--) {
    let instance = instances[i]
    if (!instance.keys) {
      if (stamp) { data(instance, val, stamp) }
      if (instance.instances) { propertyChange(instance, val, stamp, changed) }
    } else {
      propertyKeys(instance, val, stamp, changed)
    }
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
    propertyChange(t, val, stamp, changed)
  }
}

module.exports = instances
