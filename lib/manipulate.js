const { removeKey } = require('./keys')
const { data } = require('./emit')

var resolveContext, getProperty

const create = (t, val, stamp, parent, key) => {
  // need to adhere to type
  const instance = { inherits: t }
  if (parent) { instance.parent = parent }
  if (key) { instance.key = key }
  // here we need to do types
  if (t.instances !== false) {
    if (!t.instances) { t.instances = [] }
    t.instances.push(instance)
  }
  if (val !== void 0) { set(instance, val, stamp) }
  return instance
}

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
  if (stamp && changed) { data(t, val, stamp) }
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
  // while loops (faster)
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
