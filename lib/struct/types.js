import { create } from '../manipulate'
import { getDefault } from '../get'

const types = (t, val, pkey, stamp) => {
  if (!t.types) { t.types = {} }
  for (let key in val) {
    let prop = val[key]
    if (t.types[key]) {
      t.types[key].set(prop, stamp)
    } else {
      if (typeof prop !== 'object' || !prop.inherits) {
        if (prop === 'self') {
          prop = t
        } else {
          prop = create(getDefault(t), prop, void 0, t)
        }
      }
      t.types[key] = prop
    }
  }
}

const type = (t, val) => {
  // here we can do type switching behaviour
  t.type = val
}

const getType = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent._p && getType(parent._p, type)
  )

export { types, type, getType }
