const { get } = require('./get')
const { addKey, removeKey } = require('./keys')

var resolveContext, removeContextProperty, contextProperty

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
            } else if (property(t, key, val[key], stamp)) {
              changed = true // dont want to fire listeners for everythign deep
            }
          }
        }
      }
    } else if (val !== void 0) {
      changed = setVal(t, val)
    }
  }

  if (stamp && changed) {
    const emitters = onData(t)
    if (emitters) {
      const listeners = emitters.keys
      let i = listeners.length
      while (--i > -1) {
        emitters[listeners[i]](t, val, stamp)
      }
    }
  }

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

const getChild = t => t.child || getChild(t.inherits)
const defintion = (t, key) => t.properties ? t.properties[key] : defintion(t.inherits, key)

const property = (t, key, val, stamp, child) => {
  const custom = !child && defintion(t, key)
  var changed
  if (custom) {
    changed = custom(t, val, key, stamp)
  } else {
    const result = get(t, key)
    if (result) {
      if (result.context) {
        changed = contextProperty(t, val, stamp, key, result)
      } else {
        changed = set(result, val, stamp)
      }
    } else {
      if (!child) { child = getChild(t) }
      if (typeof child === 'function') {
        // kinda expect you to do normal shit
        changed = child(t, key, val, stamp)
      } else {
        changed = true
        addKey(t, key)
        const result = create(child, val, stamp)
        result.key = key
        result.parent = t
        t[key] = result
      }
    }
  }
  return changed
}

exports.set = set
exports.create = create
exports.property = property
const context = require('./context')
resolveContext = context.resolveContext
removeContextProperty = context.removeContextProperty
contextProperty = context.contextProperty
