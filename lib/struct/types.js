import { create } from '../manipulate'
import { getDefault } from '../get'

const types = (t, val) => {
  if (!t.types) { t.types = {} }
  for (let key in val) {
    let prop = val[key]
    if (typeof prop === 'object' && prop.inherits) {
      t.types[key] = prop
    } else {
      t.types[key] = create(getDefault(t), prop, void 0, t)
    }
  }
}

const type = (t, val) => {
  t.type = val
  // console.log('when not of the same type remove it', t.key, val)
}

const getType = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent._p && getType(parent._p, type)
  )

export { types, type, getType }
