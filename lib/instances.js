const { addKey, removeKey, copy } = require('./keys')
const { data } = require('./emit')

// NEED TO HANDLE REMOVE -- instances need to get killed
const update = (t, val, key, resolved) => {
  if (!(key in t)) {
    if (key !== 'val') {
      if (val[key] === null) {
        removeKey(t, key)
      } else {
        if (t._ks) {
          addKey(t, key)
        } else if (!resolved) {
          copy(t)
          return 1
        }
      }
    }
    return true
  } else {
    if (resolved !== void 0 && t._ks && val[key] === null && t[key]) {
      addKey(t, key)
    }
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
  if (val === null) {
    console.log('instance removal -- totally different ballgame')
  }
  if (changed === true) {
    valChange(t, val, stamp, changed)
  } else {
    propertyChange(t, val, stamp, changed)
  }
}

module.exports = instances
