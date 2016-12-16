import { get } from './get'
import { addKey } from './keys'
import { create, set } from './manipulate'
import { contextProperty } from './context'

const property = (t, val, key, stamp, struct) => {
  var changed
  const result = get(t, key)
  if (result && result.inherits) {
    if (result.context) {
      contextProperty(t, val, stamp, key, result)
    } else {
      set(result, val, stamp)
      changed = val === null
    }
  } else {
    changed = true
    addKey(t, key)
    console.log('CREATE', key)
    create(struct, val, stamp, t, key)
  }
  return changed
}

const getProp = (t, key) => t.props
  ? key in t.props && t.props[key] || t.props.default
  : getProp(t.inherits, key)

export { getProp, property }
