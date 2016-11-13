const { removeKey } = require('./keys')
const { data } = require('./emit')
const { listener } = require('./struct/listener')
const instances = require('./instances')

var resolveContext, getProp, getType, promise, generator, isGeneratorFunction, iterator

const create = (t, val, stamp, parent, key) => {
  var instance
  if (parent) {
    if (val && typeof val === 'object' && val.type) {
      t = getType(parent, val.type, t) || t
    }
    instance = new t.Constructor()
    instance._p = parent
    instance._k = key
    instance.inherits = t
  } else {
    instance = new t.Constructor()
    instance.inherits = t
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

const set = (t, val, stamp) => {
  var changed
  if (t.context) {
    return resolveContext(t, val, stamp)
  } else {
    const type = typeof val
    // and stream of course
    if (type === 'function') {
      if (isGeneratorFunction(val)) {
        generator(t, val, stamp)
      } else {
        changed = setVal(t, val)
      }
    } else if (type === 'object') {
      if (!val) {
        remove(t, stamp)
        changed = true
      } else {
        if (val.inherits) {
          changed = setVal(t, val, true)
        } else if (val.then && typeof val.then === 'function') {
          promise(t, val, stamp)
        } else if (val.next && typeof val.next === 'function') {
          iterator(t, val, stamp)
        } else if (val[0] && val[0] === '@') {
          changed = reference(t, val, stamp)
        } else {
          if (t.instances) {
            for (let key in val) {
              if (
                key !== 'val'
                  ? getProp(t, key)(t, val[key], key, stamp)
                  : setVal(t, val.val, 1, stamp)
              ) {
                if (!changed) {
                  changed = [ key ]
                } else {
                  changed.push(key)
                }
              }
            }
          } else {
            for (let key in val) {
              if (
                key !== 'val'
                  ? getProp(t, key)(t, val[key], key, stamp)
                  : setVal(t, val.val, 1, stamp)
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
    if (t.instances) { instances(t, val, stamp, changed) }
  }
  return changed
}

const getOnProp = t => t.props && t.props.on || getOnProp(t.inherits)

const onContext = (t, context) => {
  if (t.on) {
    if (context) {
      t.on.context = context
      t.on.contextLevel = 1
    }
  } else if (t.inherits) {
    onContext(t.inherits, context || t)
  }
}

const setVal = (t, val, ref, stamp) => {
  if (t.val !== val) {
    if (t.val && typeof t.val === 'object' && t.val.inherits) {
      listener(val.on.data, null, uid(t))
    }
    if (ref) {
      if (ref === 1) {
        // if val === null something is wrong
        if (typeof val === 'object') {
          if (!val.inherits) {
            if (val.then && typeof val.then === 'function') {
              promise(t, val, stamp)
              return
            } else if (val.next && typeof val.next === 'function') {
              iterator(t, val, stamp)
              return
            } else if (val[0] && val[0] === '@') {
              return reference(t, val, stamp)
            }
            return true
          }
        } else {
          t.val = val
          return true
        }
      }
      t.val = val
      if (val.on) {
        if (!val.on.data) {
          getOnProp(val)(val, { data: void 0 })
        }
        listener(val.on.data, t, uid(t))
      } else {
        onContext(val)
        getOnProp(val)(val, { data: void 0 })
        listener(val.on.data, t, uid(t))
      }
    } else {
      t.val = val
    }
    return true
  }
}

const removeBody = (t, stamp) => {
  if (t._async) { delete t._async }
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.on.data, null, uid(t))
  }
  if (t.inherits.instances) {
    const instances = t.inherits.instances
    let i = instances.length
    while (i--) { instances.splice(i, 1) }
  }
  t.val = null
  if (t._ks) {
    const keys = t._ks
    for (let i = 0, len = keys.length; i < len; i++) {
      if (keys[i] in t) {
        removeBody(t[keys[i]], stamp)
      }
    }
  }
}

const remove = (t, stamp) => {
  const parent = t._p
  const key = t._k
  removeBody(t, stamp)
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
promise = require('./async').promise
isGeneratorFunction = require('./async').isGeneratorFunction
generator = require('./async').generator
iterator = require('./async').iterator

const get = require('./get/api')
const reference = (t, val, stamp) => set(t, get(t, val.slice(1), {}, stamp))
