const { property } = require('../property')
const { create } = require('../manipulate')
const { listener, addFn, replace } = require('./listener')
const struct = require('./')

const emitter = create(struct, {
  instances: false,
  props: { default: listener }
})

const updateInstances = (t, val, original) => {
  let i = t.instances.length
  while (i--) {
    let instance = t.instances[i]
    if (instance.fn) {
      for (let j in val) {
        let update
        if ((!val[j] || typeof val[j] === 'function') && !(j in instance)) {
          update = true
          if (val[j] === null) {
            replace(instance.fn, original[j])
          } else {
            addFn(instance, val[j])
          }
        }
        if (update && instance.instances) {
          updateInstances(instance, val, original)
        }
      }
    }
  }
}

const emitterProperty = (t, val, key, stamp) => {
  if (val && key in t && t[key] && t[key].instances) {
    updateInstances(t[key], val, t[key])
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
