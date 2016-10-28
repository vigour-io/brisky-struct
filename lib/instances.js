const { addKey, removeKey } = require('./keys')
const { data } = require('./emit')

// NEED TO HANDLE REMOVE -- instances need to get killed

const propertyKeys = (t, val, stamp, changed) => {
  var j = changed.length
  var inherits
  while (j--) {
    let key = changed[j]
    if (!(key in t)) {
      inherits = true
      if (key !== 'val') {
        if (val[key] === null) {
          removeKey(t, key)
        } else {
          addKey(t, key)
        }
      }
    }
  }
  if (inherits) {
    if (stamp) { data(t, val, stamp) }
    if (t.instances) { propertyChange(t, val, stamp, changed) }
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
