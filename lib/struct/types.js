const { create } = require('../manipulate')

// typeCache on the type object

exports.types = (t, val) => {
  if (!t.types) { t.types = {} }
  // types of types have to come from create bit shitty
  for (let key in val) {
    let prop = val[key]
    let type = getType(t, typeof prop === 'object' && prop.type || 'struct')
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
