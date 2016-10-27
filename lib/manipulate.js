const { removeKey } = require('./keys')
const { data } = require('./emit')
const { listener } = require('./struct/on')

var resolveContext, getProp, getType

const create = (t, val, stamp, parent, key) => {
  var instance
  if (parent) {
    if (val && typeof val === 'object' && val.type) {
      t = getType(parent, val.type, t) || t
    }
    instance = { parent, key, inherits: t }
  } else {
    instance = { inherits: t }
  }
  if (t.instances !== false) {
    if (!t.instances) {
      t.instances = [ instance ]
    } else {
      t.instances.push(instance)
    }
  }
  if (val !== void 0) {
    set(instance, val, stamp)
  }
  return instance
}

// need uid in state
var cnt = 1e4 // so now a limition becomes 10k fns normal
const uid = t => { return t.uid || (t.uid = ++cnt) }

// need to get info REMOVED PROP or VAL
const instances = (t, val, stamp, changed) => {
  if (t.instances) {
    let i = t.instances.length
    while (--i > -1) {
      if (changed === true) {
        if (t.instances[i].val === void 0) {
          if (stamp) {
            data(t.instances[i], val, stamp)
          }
          instances(t.instances[i], val, stamp, changed)
        }
      } else {
        console.log('hard case', changed)
        // HARD
      }
    }
  }
}

const set = (t, val, stamp) => {
  var changed
  if (t.context) {
    // prob should not fire on resolving context
    return resolveContext(t, val, stamp)
  } else {
    const type = typeof val
    if (type === 'object' && type !== 'function') {
      if (!val) {
        remove(t, stamp)
        changed = true
      } else {
        if (val.inherits) {
          changed = setVal(t, val, true)
        } else {
          if (t.instances) {
            for (let k in val) {
              if (k !== 'val'
                ? getProp(t, k)(t, val[k], k, stamp)
                : setVal(t, val.val)
              ) {
                if (!changed) {
                  changed = [ k ]
                } else {
                  changed.push(k)
                }
              }
            }
          } else {
            for (let k in val) {
              if (k !== 'val'
                ? getProp(t, k)(t, val[k], k, stamp)
                : setVal(t, val.val)
              ) {
                changed = true
              }
            }
          }
        }
      }
    } else {
      changed = setVal(t, val)
    }
  }
  if (changed) {
    if (stamp) { data(t, val, stamp) }
    instances(t, val, stamp, changed)
  }
  return changed
}

const getOn = t => t.props && t.props.on || getOn(t.inherits)

const setVal = (t, val, isReference) => {
  if (t.val !== val) {
    if (t.val && typeof t.val === 'object' && t.val.inherits) {
      listener(val.on.data, null, uid(t))
    }
    if (isReference) {
      if (val.on && val.on.data) {
        listener(val.on.data, t, uid(t))
      } else {
        getOn(t)(val, { data: void 0 }, 'on')
        listener(val.on.data, t, uid(t))
      }
    }
    t.val = val
    return true
  }
}

const removeBody = (t, stamp) => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.on.data, null, uid(t))
  }
  t.val = null
  const keys = t.keys
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      removeBody(t[keys[i]], stamp)
    }
  }
}

const remove = (t, stamp) => {
  removeBody(t, stamp)
  const parent = t.parent
  const key = t.key
  if (parent && key) {
    removeKey(parent, key)
    parent[key] = null
  }
}

exports.set = set
exports.create = create
resolveContext = require('./context').resolveContext
getProp = require('./property').getProp
getType = require('./struct/types').getType
