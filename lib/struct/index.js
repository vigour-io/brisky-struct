import { create, set } from '../manipulate'
import { property } from '../property'
import { types, type } from './types'
import { getDefault } from '../get'
import inject from './inject'
import on from './on'

const struct = {}
const getProps = t => t.props || getProps(t.inherits)

const props = {
  types,
  type,
  inject,
  async: (t, val) => { if (t.async && !val) { delete t.async } },
  key: (t, val) => { t.key = val },
  instances: (t, val) => { t.instances = val },
  $transform: (t, val) => { t.$transform = val },
  reset: (t, val, key, stamp, isNew, original) => {
    if (!original.type) {
      t.forEach(val === true
        ? p => p.set(null, stamp)
        : (p, key) => val.indexOf(key) === -1 && p.set(null, stamp)
      )
    }
  },
  props: (t, val, pkey, stamp) => {
    var props = t.props
    if (!props) {
      const previous = getProps(t)
      props = t.props = {}
      if (previous) { for (let key in previous) { props[key] = previous[key] } }
    }
    for (let key in val) { parse(t, val[key], key, stamp, props) }
  }
}

const simple = (t, val, key) => { t[key] = val }

const notSelf = (t, key, struct) => t.props &&
  t.props[key] && t.props[key].struct === struct ||
  t.inherits && notSelf(t.inherits, key, struct)

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
struct.types = { struct }

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
props.default.struct = type.struct = types.struct = struct

inject(struct, on)
struct.type = create(struct, 'struct')

export default struct
