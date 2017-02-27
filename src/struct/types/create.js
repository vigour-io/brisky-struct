import getType from './get'
import createSetObj from './set'
import { set } from '../../manipulate'

const createType = (parent, val, t, stamp, key) => {
  const type = val.type
  console.log('type!', type)
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
    set(instance, createSetObj(t, true, instance), stamp)
  }
  return instance
}

export default createType
