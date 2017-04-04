import getType from './get'
import { set } from '../../manipulate'

// create set obj can go away
const createSetObj = (t, top) => {
  const result = {}
  const keys = t._ks
  if (t.type && !top) result.type = t.type.compute()
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let field = t[key]
      if (field) result[key] = createSetObj(field, false)
    }
  }
  if (t.val !== void 0) result.val = t.val
  return result
}

const createType = (parent, val, t, stamp, key) => {
  const type = val.type
  const constructor = getType(parent, type, t, stamp) || t
  const instance = new constructor.Constructor()
  instance.inherits = constructor
  if (constructor.instances !== false) {
    if (!constructor.instances) {
      constructor.instances = [ instance ]
    } else {
      constructor.instances.push(instance)
    }
  }

  //   if (constructor !== t && key && t.key === key && !val.reset && (t._ks || t.val !== void 0)) {

  if (constructor !== t && key && t.key === key && (t._ks || t.val !== void 0)) {
    // this has to become stronger / better
    // also need to call merge in the update path from original
    // need to handle types better -- from original to context and vice-versa
    set(instance, createSetObj(t, true, instance), stamp)
  }
  return instance
}

export default createType
