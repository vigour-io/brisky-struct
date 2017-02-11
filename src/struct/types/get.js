import { root } from '../../traversal'
import { get } from '../../get'
import { set } from '../../manipulate'

const getType = (parent, type, t, stamp) => {
  if (typeof type === 'object') type = type.val
  var result = getTypeInternal(parent, type, t)
  if (!result) {
    parent = root(parent)
    // set is fucked
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
