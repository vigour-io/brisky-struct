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
  console.log('when not of the same type remove it', t.key, val)
}

const getProp = t => t.props ? t.props.type : t.inherits && getProp(t.inherits)

// also give a warning here
const getType = (parent, type, t) =>
  // isnt the string chec enough?
  (typeof type === 'string' && (!t || getProp(t))) &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent.parent && getType(parent.parent, type)
  )

exports.getType = getType
