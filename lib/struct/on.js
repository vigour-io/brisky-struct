const { property } = require('../property')
const { create } = require('../manipulate')
const { listener, addFn, replace } = require('./listener')
const struct = require('./')

const emitter = create(struct, {
  instances: false,
  props: { default: listener }
})

const instances = (t, val, original, fields) => {
  let i = t.instances.length
  while (i--) {
    let instance = t.instances[i]
    if (instance.fn) {
      if (!fields) { fields = Object.keys(val) }
      let j = fields.length
      if (instance.instances) {
        let update
        while (j--) {
          let key = fields[j]
          if (!(key in instance) && (!val[key] || typeof val[key] === 'function')) {
            if (!update) {
              update = [ key ]
            } else {
              update.push(key)
            }
            if (val[key] === null) {
              replace(instance.fn, original[key])
            } else {
              addFn(instance, val[key])
            }
          }
        }
        if (update) {
          instances(instance, val, original, update)
        }
      } else {
        while (j--) {
          let key = fields[j]
          if (!(key in instance) && (!val[key] || typeof val[key] === 'function')) {
            if (val[key] === null) {
              replace(instance.fn, original[key])
            } else {
              addFn(instance, val[key])
            }
          }
        }
      }
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
