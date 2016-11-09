// can be an injectable
module.exports = struct => {
  const { property } = require('../property')
  const { create, set } = require('../manipulate')
  const { listener, addFn, replace } = require('./listener')

  const emitter = create(struct, {
    instances: false,
    props: { default: listener }
  })

  const update = (t, val, key, original) => {
    if (!(key in t)) {
      const field = val[key]
      if (!field || typeof field === 'function') {
        if (field === null) {
          replace(t.fn, original[key])
        } else {
          addFn(t, field)
        }
        return true
      }
    }
  }

  const instances = (t, val, original, fields) => {
    let i = t.instances.length
    while (i--) {
      let instance = t.instances[i]
      if (instance.fn) {
        if (!fields) { fields = Object._ks(val) }  // can use something else for perf
        let j = fields.length
        if (instance.instances) {
          let inherits
          while (j--) {
            let key = fields[j]
            if (update(instance, val, key, original)) {
              if (!inherits) {
                inherits = [ key ]
              } else {
                inherits.push(key)
              }
            }
          }
          if (inherits) { instances(instance, val, original, inherits) }
        } else {
          while (j--) { update(instance, val, fields[j], original) }
        }
      } else if (instance.instances) {
        instances(instance, val, original, fields)
      }
    }
  }

  const emitterProperty = (t, val, key, stamp) => {
    if (val && key in t && t.instances) {
      const field = t[key]
      if (field) { instances(field, val, field) }
    }
    return property(t, val, key, stamp, emitter)
  }
  emitterProperty.struct = emitter

  const getOn = t => t.on || t.inherits && getOn(t.inherits)

  const onStruct = create(struct, {
    instances: false,
    props: {
      default: emitterProperty
    }
  })

  const on = (t, val, key, stamp) => {
    const result = getOn(t)
    if (result) {
      if (result.context) {
        t.on = create(result, val, stamp, t, key)
      } else {
        set(result, val, stamp)
      }
    } else {
      t.on = create(onStruct, val, stamp, t, key)
    }
  }

  struct.props.on = on
  on.struct = onStruct
}
