const { create, set } = require('../manipulate')
const { property } = require('../property')
const { types, type } = require('./types')
const { getDefault } = require('../get')

const getProps = t => t.props || getProps(t.inherits)
const inject = require('./inject')

const props = {
  types,
  type,
  inject,
  instances: (t, val) => { t.instances = val },
  $transform: (t, val) => { t.$transform = val },
  props: (t, val, key, stamp) => {
    var props = t.props
    if (!props) {
      const previous = getProps(t)
      props = t.props = {}
      if (previous) {
        for (let key in previous) {
          props[key] = previous[key]
        }
      }
    }
    for (let key in val) {
      parse(t, val[key], key, stamp, props)
    }
  }
}

const simple = (t, val, key) => { t[key] = val }

const notSelf = (t, key, struct) => t.props &&
  t.props[key] && t.props[key].struct === struct ||
  t.inherits && notSelf(t.inherits)

const parse = (t, val, key, stamp, props) => {
  if (val === true) {
    props[key] = simple
  } else if (val === null) {
    if (props[key]) { delete props[key] }
  } else if (typeof val !== 'function') {
    let struct
    if (typeof val === 'object' && val.inherits) {
      struct = val
    } else if (val === 'self') {
      struct = t
    } else {
      const inherit = props[key] && props[key].struct
      if (inherit) {
        if (notSelf(t.inherits, key, inherit)) {
          struct = create(inherit, val, void 0, t)
        } else {
          set(inherit, val)
          return
        }
      } else {
        struct = create(getDefault(t), val, void 0, t)
      }
    }
    const definition = (t, val, key, stamp) => property(t, val, key, stamp, struct)
    definition.struct = struct
    props[key] = definition
  } else {
    props[key] = val
  }
}

const struct = {}
struct.instances = false
struct.props = props
struct.types = { struct }

props.default = (t, val, key, stamp) => property(t, val, key, stamp, struct)
props.default.struct = struct

module.exports = struct

parse(struct, require('./on').on, 'on', void 0, props)
