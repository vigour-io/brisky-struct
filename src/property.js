import { get } from './get'
import { addKey } from './keys'
import { create, set } from './manipulate'
import { contextProperty } from './context'

const property = (t, val, key, stamp, struct, isNew, reset, noConflict) => {
  var changed
  const result = get(t, key)
  if (result && result.inherits) {
    if (result._c) {
      // also need to do some stuff here
      // if (global.DEBUG) console.log('context set', result.path())
      contextProperty(t, val, stamp, key, result, reset, noConflict)
    } else {
      set(result, val, stamp, void 0, reset, noConflict)
      changed = val === null
    }
  } else {
    changed = true
    addKey(t, key)
    create(struct, val, stamp, t, key, reset, noConflict)
  }
  return changed
}

const propertyNE = (t, val, key, stamp, struct, isNew, reset, noConflict) => {
  var changed
  const result = get(t, key)
  if (result && result.inherits) {
    if (result._c) {
      // also need to do some stuff here
      contextProperty(t, val, stamp, key, result, reset, noConflict)
    } else {
      set(result, val, stamp, void 0, reset, noConflict)
      changed = val === null
    }
  } else {
    changed = true
    create(struct, val, stamp, t, key, reset, noConflict)
  }
  return changed
}

const getProp = (t, key) => t.props
  ? key && (key in t.props && t.props[key]) || t.props.default
  : getProp(t.inherits, key)

export { getProp, property, propertyNE }
