const { property } = require('../property')
const { create } = require('../manipulate')
const { listener, addFn, replace } = require('./listener')
const struct = require('./')

const emitter = create(struct, {
  instances: false,
  props: { default: listener }
})

const update = (t, key, val, original) => {
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
      if (!fields) { fields = Object.keys(val) }
      let j = fields.length
      if (instance.instances) {
        let updateFields
        while (j--) {
          let key = fields[j]
          if (update(instance, key, val, original)) {
            if (!updateFields) {
              updateFields = [ key ]
            } else {
              updateFields.push(key)
            }
          }
        }
        if (updateFields) {
          instances(instance, val, original, updateFields)
        }
      } else {
        while (j--) {
          update(instance, fields[j], val, original)
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
