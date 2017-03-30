import { getKeys } from '../keys'
import { get, getProps, getFn, getVal } from '../get'
import { getProp } from '../property'
import { resolveFromValue } from '../references' // rdy for this
// also add resolveFromReference
import { data } from '../emit'

const getKeyProp = (t, key) => t.props
  ? key && (key in t.props && t.props[key])
  : getKeyProp(t.inherits, key)

const props = (t, inherits) => {
  if (t.props) {
    let own
    for (let key in t.props) {
      const prop = getProp(inherits, key)
      if (!prop || t.props[key].struct != prop.struct) { // eslint-disable-line
        if (!own) own = {}
        own[key] = t.props[key]
      }
    }
    return own
  }
}

const switchInheritance = (t, inherits, stamp, fromInstance) => {
  var inheritsKeys, keys
  const old = t.inherits
  const instances = old.instances
  const tProps = props(t, old)
  t.inherits = inherits

  if (tProps) {
    const previous = getProps(inherits)
    const props = t.props = {}

    for (let key in previous) {
      props[key] = previous[key]
    }
    for (let key in tProps) {
      if (tProps[key].struct) {
        switchInheritance(tProps[key].struct, (
          (tProps.default ? getKeyProp(t, key) : tProps.default) || getProp(t, key)
        ).struct)
        props[key] = tProps[key]
      }
    }
  }

  if (t._ks && (inheritsKeys = getKeys(inherits))) {
    if (!keys) keys = []
    for (let i = 0, len = inheritsKeys.length; i < len; i++) {
      const key = inheritsKeys[i]
      if (!(key in t)) keys.push(key)
    }
    for (let i = 0, len = t._ks.length; i < len; i++) {
      const key = t._ks[i]
      if (key in t) {
        keys.push(key)
        const prop = getProp(t, key)
        if (prop.struct) {
          switchInheritance(t[key], get(inherits, key, true) || prop.struct, stamp)
        } else {
          console.log('  PROPS ON NEW INHERITANCE IS NOT A STRUCT -- switching inheritance - not supported yet', key)
        }
      }
    }
    t._ks = keys
  }

  if (inherits !== old) {
    if (instances) {
      let i = instances.length
      while (i--) {
        if (instances[i] === t) {
          instances.splice(i, 1)
          break
        }
      }
    }
    if (inherits.instances !== false) {
      if (!inherits.instances) inherits.instances = []
      console.log('  add to instances....', t, inherits)
      inherits.instances.push(t)
    }
  }

  const inheritsEmitters = get(inherits, 'emitters', true)

  if (t.emitters) {
    const keys = getKeys(t.emitters)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        handleEmitters(t, t.emitters, inheritsEmitters, keys[i])
      }
    }
  }

  if (t.instances) {
    for (let i = 0, len = t.instances.length; i < len; i++) {
      switchInheritance(t.instances[i], t, stamp, true)
    }
  }

  const val = getVal(t)
  if (typeof val === 'object' && val.inherits) {
    resolveFromValue(inherits, val, stamp)
  }

  if (stamp && !fromInstance) data(t, void 0, stamp, false)
}

// ok so need to make a nice list of shit with keys make a new object
const inheritedEmitter = (emitter, result = {}) => {
  eachListener(emitter, (listener, key) => {
    if (typeof listener === 'function' && !(key in result)) {
      result[key] = listener
    }
  })
  if (emitter.inherits) inheritedEmitter(emitter.inherits, result)
  return result
}

const eachListener = (emitter, fn) => {
  for (let key in emitter) {
    if (
      key !== '_p' &&
      key !== 'key' &&
      key !== 'fn' &&
      key !== '_c' &&
      key !== '_cLevel' &&
      key !== 'instances' &&
      key !== 'inherits'
    ) {
      fn(emitter[key], key)
    }
  }
}

const handleEmitters = (t, emitters, inherits, key) => {
  const emitter = emitters[key]
  const inheritsEmitter = inherits && get(inherits, key, true)
  const fn = emitter.fn
  const newFn = []

  eachListener(emitter, (listener, key) => {
    if (typeof listener === 'function') newFn.push(listener)
  })

  if (fn) {
    const inheritsFn = inheritsEmitter && getFn(inheritsEmitter)
    if (inheritsFn) {
      const result = inheritedEmitter(inheritsEmitter)
      for (let key in result) {
        if (!(key in emitter)) {
          newFn.push(result[key])
        }
      }
    }
  }

  emitter.fn = newFn
}

export { switchInheritance }
