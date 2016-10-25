const { removeKey } = require('./keys')
const { data } = require('./emit')
const { listener } = require('./struct/on')
// const { get } = require('./get')

var resolveContext, getProperty

const create = (t, val, stamp, parent, key) => {
  // take care of type!
  var instance
  if (parent) {
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
// what about minus? test speed
const uid = t => { return t.uid || (t.uid = ++cnt) }

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
          for (let key in val) {
            if (key === 'val') {
              if (setVal(t, val.val)) { changed = true }
            } else if (getProperty(t, key)(t, val[key], key, stamp)) {
              changed = true
            }
          }
        }
      }
    } else {
      changed = setVal(t, val)
    }
  }
  if (stamp && changed) { data(t, val, stamp) }
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
  // need to add val = null (to know its removed)
  removeBody(t, stamp)
  const parent = t.parent
  const key = t.key
  // need to handle this better but need something like this
  // need to fire listeners arround here or even on stamp
  if (parent && key) {
    removeKey(parent, key)
    // so if not parent context
    // then delete ELSE
    // can also just do this for clients for example
    // if (get(parent.inherits, key)) {
    //   // maybe go fro the removed keys trick
    //   // think about this will safe shit loads of mem
    //   delete parent[key]
    // } else {
    parent[key] = null
    // reason we dont want to remove is to gaurd against proto updates

    // }
  }
}

exports.set = set
exports.create = create
resolveContext = require('./context').resolveContext
getProperty = require('./property').getProperty
