import getType from './get'
import { createSetObj } from '../../inheritance'
import { set } from '../../manipulate'

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

  if (constructor !== t && key && t.key === key && !val.reset && (t._ks || t.val !== void 0)) {
    // this has to become stronger / better
    // also need to call merge in the update path from original
    // need to handle types better -- from original to context and vice-versa
    set(instance, createSetObj(t, true, instance), stamp)
  }
  return instance
}

export default createType
