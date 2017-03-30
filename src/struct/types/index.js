import { create, set } from '../../manipulate'
import { getDefault, get } from '../../get'
import { addKey } from '../../keys'
import { getProp } from '../../property'
import { contextProperty } from '../../context'
import { switchInheritance } from '../../inheritance'
import getType from './get'

const inheritType = t => t.type || t.inherits && inheritType(t.inherits)

const type = (t, val, key, stamp, isNew, original) => {
  var isObject
  if (typeof val === 'object') {
    if (!val) {
      // console.log('remove type')
    } else if (val.stamp && val.val && !val.inherits) {
      if (!stamp) stamp = val.stamp
      val = val.val
    } else if (val.inherits) {
      isObject = true
    } else {
      isObject = true
    }
  }

  if (!isNew && t._p) {
    if (isObject) {
      // console.log('switch using object - not supported yet')
    } else {
      let type = t.type || inheritType(t)
      type = type && type.compute()
      if (type !== val) {
        switchInheritance(t, getType(t._p, val, t, stamp), stamp)
        if (original.reset) set(t, { reset: true }, stamp) // maybe deprecate this...
      }
    }
  }

  if (t.type) {
    return set(t.type, val, stamp) && 2
  } else {
    t.type = create(getProp(t, key).struct, val, stamp, t, key)
    return 2
  }
}

const inherits = (prop, t) => {
  while (t) {
    if (t === prop) return true
    t = t.inherits
  }
}

const types = struct => {
  const types = (t, val, key, stamp) => {
    // decided to not support references, when using a struct it automaticly becomes the type
    var changed
    if (!t.types) {
      const prop = getProp(t, key).struct
      let cntx = get(t, 'types')
      if (cntx && !inherits(prop, cntx)) cntx = false
      t.types = create(cntx || prop, void 0, stamp, t, key)
      if (!cntx) changed = 2
    }
    set(t.types, val, stamp)
    return changed
  }

  types.struct = create(struct, {
    instances: false,
    props: {
      default: (t, val, key, stamp, isNew) => {
        var changed
        const result = get(t, key)
        if (result) {
          if (result._c) {
            contextProperty(t, val, stamp, key, result)
          } else {
            set(result, val, stamp)
            changed = val === null
          }
        } else {
          addKey(t, key)
          if (val === 'self') {
            t[key] = t._p
          } else if (typeof val === 'object' && val.inherits) {
            t[key] = val
          } else {
            create(getDefault(t._p), val, stamp, t, key)
          }
          changed = true
        }
        return changed
      }
    }
  })

  types.struct.props.default.struct = type.struct = struct
  set(struct, { props: { type, types }, types: { struct } })
  struct.types._ks = void 0 // remove struct key
  struct.type = create(struct, 'struct')
}

export { types, getType }
