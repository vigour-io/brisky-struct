import { addKey, copy } from './keys'
import { data } from './emit'
import { switchInheritance } from './inheritance'

const update = (t, val, key, resolved, from) => {
  if (!(key in t)) {
    if (key !== 'val') {
      if (val[key] !== null) {
        if (!resolved) {
          if (t._ks) {
            addKey(t, key)
          } else {
            copy(t)
            return 1
          }
        }
      }
    }
    return true
  } else {
    if (val[key] === null && t[key]) {
      // do removal better
      if (!t._ks) {
        copy(t)
        addKey(t, key)
        return 1
      } else {
        addKey(t, key) // no update
      }
    } else if (t[key] && from[key]) {
      switchInheritance(t[key], from[key])
    }
  }
}

const propertyKeys = (t, val, stamp, changed, resolved, override, from) => {
  var j = changed.length
  var inherits
  if (t.instances) {
    while (j--) {
      let key = changed[j]
      let res = update(t, val, key, resolved, from)
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
      if (stamp) { data(t, val, stamp, override) }
      propertyChange(t, val, stamp, inherits, resolved, override)
    }
  } else {
    while (j--) {
      inherits = update(t, val, changed[j], resolved, from)
      if (inherits === 1) { resolved = inherits }
    }
    if (inherits && stamp) {
      data(t, val, stamp, override)
    }
  }
}

const propertyChange = (t, val, stamp, changed, resolved, override, from) => {
  const instances = t.instances
  let i = instances.length
  while (i--) {
    let instance = instances[i]
    propertyKeys(instance, val, stamp, changed, resolved, override, from)
  }
}

const valChange = (t, val, stamp, changed, override) => {
  const instances = t.instances
  let i = instances.length
  while (i--) {
    let instance = instances[i]
    if (instance.val === void 0) {
      if (stamp) { data(instance, val, stamp, override) }
      if (instance.instances) { valChange(instance, val, stamp, changed, override) }
    }
  }
}

const instances = (t, val, stamp, changed, override) => {
  if (changed === true) {
    valChange(t, val, stamp, changed, override)
  } else {
    propertyChange(t, val, stamp, changed, void 0, override, t)
  }
}

export default instances
