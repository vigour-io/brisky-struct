import { data } from './emit'
import { listener } from './struct/listener'
import uid from './uid'
import instances from './instances'
import remove from './remove'
import async from './async'

var resolveContext, getProp, getType

// promise, generator, isGeneratorFunction, iterator

const create = (t, val, stamp, parent, key) => {
  var instance
  if (parent) {
    if (val && typeof val === 'object' && val.type) {
      t = getType(parent, val.type, t) || t
    }
    instance = new t.Constructor()
    instance._p = parent
    instance.inherits = t
    if (key !== void 0) {
      instance.key = key
      parent[key] = instance
    }
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

var set = (t, val, stamp) => {
  var changed
  if (t.context) {
    return resolveContext(t, val, stamp)
  } else {
    const type = typeof val
    if (type === 'function') {
      if (isGeneratorFunction(val)) {
        generator(t, val, stamp)
      } else {
        changed = setVal(t, val)
      }
    } else if (type === 'object') {
      if (!val) {
        remove(t, stamp)
        return true
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
  if (t.emitters) {
    if (context) {
      t.emitters.context = context
      t.emitters.contextLevel = 1
    }
  } else if (t.inherits) {
    onContext(t.inherits, context || t)
  }
}

const setVal = (t, val, ref, stamp) => {
  if (t.val !== val) {
    if (t.val && typeof t.val === 'object' && t.val.inherits) {
      listener(t.val.emitters.data, null, uid(t))
    }
    if (ref) {
      if (ref === 1) {
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
            t.val = val
            return true
          }
        } else {
          t.val = val
          return true
        }
      }
      t.val = val
      if (val.emitters) {
        if (!val.emitters.data) {
          getOnProp(val)(val, { data: void 0 }, 'on')
        }
        listener(val.emitters.data, t, uid(t))
      } else {
        onContext(val)
        getOnProp(val)(val, { data: void 0 }, 'on')
        listener(val.emitters.data, t, uid(t))
      }
    } else {
      t.val = val
    }
    return true
  }
}

export { set, create }

import { resolveContext as cr } from './context'
import { getProp as gp } from './property'
import { getType as gt } from './struct/types'

// import {
//   promise as prom,
//   isGeneratorFunction as isf,
//   generator as gen,
//   iterator as ite
// } from './async'

resolveContext = cr
getProp = gp
getType = gt

// promise = prom
// isGeneratorFunction = isf
// generator = gen
// iterator = ite

import getApi from './get/api'
const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

const { promise, generator, isGeneratorFunction, iterator } = async(set)
