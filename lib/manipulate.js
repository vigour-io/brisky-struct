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
      // if is iterator
      if (!val) {
        remove(t, stamp)
        changed = true
      } else {
        if (val.inherits) {
          changed = setVal(t, val, true)
        } else if (val.then && typeof val.then === 'function') {
          promise(t, val, stamp)
        } else if (val.next && typeof val.next === 'function' && typeof val.throw === 'function') {
          iterator(t, val, stamp)
        } else {
          if (t.instances) { // wastefull check can be shared with the bottom
            for (let k in val) {
              // try to clean this up
              if (k !== 'val' ? getProp(t, k)(t, val[k], k, stamp) : setVal(t, val.val, 1)) {
                if (!changed) {
                  changed = [ k ]
                } else {
                  changed.push(k)
                }
              }
            }
          } else {
            for (let k in val) {
              if (k !== 'val' ? getProp(t, k)(t, val[k], k, stamp) : setVal(t, val.val, 1)) {
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

const getOn = t => t.props && t.props.on || getOn(t.inherits)

const setVal = (t, val, ref) => {
  if (t.val !== val) {
    if (t.val && typeof t.val === 'object' && t.val.inherits) {
      listener(val.on.data, null, uid(t))
    }
    t.val = val
    if (ref) {
      if (ref === 1) { // clean this up
        if (typeof val !== 'object' || !val.inherits) {
          return true
        }
      }
      if (val.on && val.on.data) {
        listener(val.on.data, t, uid(t))
      } else {
        getOn(t)(val, { data: void 0 }, 'on')
        listener(val.on.data, t, uid(t))
      }
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
  if (t.keys) {
    const keys = t.keys
    for (let i = 0, len = keys.length; i < len; i++) {
      if (keys[i] in t) {
        removeBody(t[keys[i]], stamp)
      }
    }
  }
}

const remove = (t, stamp) => {
  const parent = t.parent
  const key = t.key
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
