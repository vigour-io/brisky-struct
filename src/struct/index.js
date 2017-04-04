import { create, set } from '../manipulate'
import { property } from '../property'
import { types } from './types'
import { getDefault, getProps } from '../get'
import inject from './inject'
import on from './on'
import reset from './reset'

const struct = {}

const props = {
  inject,
  async: (t, val) => { if (t.async && !val) { delete t.async } },
  key: (t, val) => { t.key = val },
  instances: (t, val) => { t.instances = val },
  $transform: (t, val) => { t.$transform = val },
  props: (t, val, pkey, stamp) => {
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

// key should be 4th argument
const notSelf = (t, key, struct) => t.props &&
  t.props[key] && t.props[key].struct === struct ||
  t.inherits && notSelf(t.inherits, key, struct)

const parse = (t, val, key, stamp, props) => {
  if (val === true) {
    props[key] = simple
  } else if (val === null) {
    t[key] = null
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

    const definition = (t, val, key, stamp, isNew) =>
      property(t, val, key, stamp, struct, isNew)

    definition.struct = struct
    props[key] = definition
  } else {
    props[key] = val
  }
}

const define = (t, value, key) => {
  Object.defineProperty(t, key, { configurable: true, value })
  return t
}

const createConstructor = (t, Inherit) => {
  function Struct () {}
  if (Inherit) { Struct.prototype = new Inherit() }
  define(Struct.prototype, Struct, 'Constructor')
  define(t, Struct, 'Constructor')
  return Struct
}

struct.instances = false
struct.props = props

createConstructor(struct)

struct.props.define = (t, val) => {
  var proto
  if (!t.hasOwnProperty('Constructor')) {
    createConstructor(t, t.Constructor)
  }
  proto = t.Constructor.prototype
  for (let key in val) {
    define(t, val[key], key)
    define(proto, val[key], key)
  }
}

props.default = (t, val, key, stamp) => property(t, val, key, stamp, struct)
props.default.struct = struct
struct.inherits = {}

inject(struct, [ on, types, reset ])

export default struct
