const { create } = require('../manipulate')

// typeCache on the type object
const getDefault = t => t.props && t.props._struct || getDefault(t.inherits)

exports.types = (t, val) => {
  if (!t.types) { t.types = {} }
  for (let key in val) {
    let prop = val[key]
    let type
    if (typeof prop === 'object' && prop.type) {
      type = getType(t, prop.type)
    } else {
      type = getDefault(t)
    }
    prop.type = key
    t.types[key] = create(type, prop)
  }
}

exports.type = (t, val) => {
  // may need to call it _type since we want to be able to strip it
  t.type = val
  console.log('when not of the same type remove it')
  // also need to be able to remove the type type
}

// and lookup of course
const getType = (t, type) => t.types && t.types[type] ||
  t.inherits && getType(t.inherits, type) ||
  t.parent && getType(t.parent, type)

exports.getType = getType
