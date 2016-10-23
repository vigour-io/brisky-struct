const { removeKey } = require('./keys')
var resolveContext, getProperty

const create = (t, val, stamp) => {
  const instance = { inherits: t }
  if (t.instances !== false) {
    if (!t.instances) { t.instances = [] }
    t.instances.push(instance)
  }
  if (val !== void 0) { set(instance, val, stamp) }
  return instance
}

const onData = t => (t.on && t.on.data) || t.inherits && onData(t.inherits)

const set = (t, val, stamp) => {
  var changed
  if (t.context) {
    changed = resolveContext(t, val, stamp)
  } else {
    const type = typeof val
    if (type === 'object' && type !== 'function') {
      if (!val) {
        remove(t, stamp)
        changed = true
      } else {
        if (val.inherits) {
          changed = setVal(t, val)
        } else {
          for (let key in val) {
            if (key === 'val') {
              if (setVal(t, val.val)) { changed = true }
                // hook it into this
            } else if (getProperty(t, key)(t, val[key], key, stamp)) {
              changed = true // dont want to fire listeners for everythign deep
            }
          }
        }
      }
    } else if (val !== void 0) {
      changed = setVal(t, val)
    }
  }

  // if (stamp && changed) {
  //   const emitters = onData(t)
  //   if (emitters) {
  //     const listeners = emitters.keys
  //     let i = listeners.length
  //     while (--i > -1) {
  //       emitters[listeners[i]](t, val, stamp)
  //     }
  //   }
  // }

  return changed
}

const setVal = (t, val) => {
  if (t.val !== val) {
    t.val = val
    return true
  }
}

const remove = (t, stamp) => {
  const parent = t.parent
  const key = t.key
  if (parent && key) {
    removeKey(parent, key)
    parent[key] = null
  }
  // need to update instances of PARENT but nothing else
  if (t.keys) {
    for (let i = 0; i < t.keys.length; i++) {
      // NESTED / REMOVES UPDATES
    }
  }
}

exports.set = set
exports.create = create
resolveContext = require('./context').resolveContext
getProperty = require('./property').getProperty
