import { get } from './get'
import { addKey } from './keys'
import { create, set } from './manipulate'
import { contextProperty } from './context'

// (t, val[key], key, stamp, isNew, val, reset)

const property = (t, val, key, stamp, struct, isNew, reset) => {
  var changed
  const result = get(t, key)
  if (result && result.inherits) {
    if (result._c) {
      // also need to do some stuff here
      contextProperty(t, val, stamp, key, result, reset)
    } else {
      set(result, val, stamp, void 0, reset)
      changed = val === null
    }
  } else {
    changed = true
    addKey(t, key)
    create(struct, val, stamp, t, key, reset)
  }
  return changed
}

const getProp = (t, key) => t.props
  ? key && (key in t.props && t.props[key]) || t.props.default
  : getProp(t.inherits, key)

export { getProp, property }
