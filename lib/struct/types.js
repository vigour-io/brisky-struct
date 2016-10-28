const { create } = require('../manipulate')
const { getDefault } = require('../get')

// def is just using default
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

// no you can make you own which is shitty but fuck it
const getProp = t => t.props ? t.props.type : t.inherits && getProp(t.inherits)

// and lookup of course
const getType = (parent, type, t) =>
  (!t || getProp(t)) &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent.parent && getType(parent.parent, type)
  )

exports.getType = getType
