import { root } from '../../traversal'
import { get } from '../../get'
import { set, create } from '../../manipulate'
import { getProp } from '../../property'

const getType = (parent, type, t, stamp) => {
  if (typeof type === 'object') {
    if (type.inherits) {
      return type
    } else if (type.val && type.stamp !== void 0) {
      type = type.val
    } else {
      return create(getProp(t).struct, type, stamp, parent)
    }
  }
  let result = getTypeInternal(parent, type, t)
  if (!result) {
    // create type
    console.log('no result - create type', type)
    parent = root(parent)
    set(parent, { types: { [type]: {} } }, stamp)
    result = parent.types[type]
  }
  return result
}

const getTypeInternal = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && get(parent.types, type) ||
    parent.inherits && getTypeInternal(parent.inherits, type) ||
    parent._p && getTypeInternal(parent._p, type)
  )

export default getType
