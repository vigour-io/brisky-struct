const { property } = require('../property')
const { create } = require('../manipulate')
const { listener, addFn, replace } = require('./listener')
const struct = require('./')

const emitter = create(struct, {
  instances: false,
  props: { default: listener }
})

const update = (t, val, key, original) => {
  if (!(key in t) && (!val[key] || typeof val[key] === 'function')) {
    if (val[key] === null) {
      replace(t.fn, original[key])
    } else {
      addFn(t, val[key])
    }
    return true
  }
}

const instances = (t, val, original, fields) => {
  let i = t.instances.length
  while (i--) {
    let instance = t.instances[i]
    if (instance.fn) {
      if (!fields) { fields = Object.keys(val) }  // feels too heavy
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
      if (!fields) { fields = Object.keys(val) }
      instances(instance, val, original, fields)
    }
  }
}

const emitterProperty = (t, val, key, stamp) => {
  if (val && key in t) {
    const emitter = t[key]
    if (emitter) { instances(emitter, val, emitter) }
  }
  return property(t, val, key, stamp, emitter)
}
emitterProperty.struct = emitter

exports.on = {
  instances: false,
  props: {
    default: emitterProperty
  }
}
