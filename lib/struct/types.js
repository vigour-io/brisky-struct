const { create } = require('../manipulate')
const { getDefault } = require('../get')

exports.types = (t, val) => {
  if (!t.types) { t.types = {} }
  for (let key in val) {
    let prop = val[key]
    // and delete of course
    if (typeof prop === 'object' && prop.inherits) {
      t.types[key] = prop
    } else {
      t.types[key] = create(getDefault(t), prop, void 0, t)
    }
  }
}

exports.type = (t, val) => {
  t.type = val
  // console.log('when not of the same type remove it', t._k, val)
}

const getType = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent._p && getType(parent._p, type)
  )

exports.getType = getType
