import { create } from '../manipulate'
import { getDefault } from '../get'

const types = (t, val, pkey, stamp) => {
  if (!t.types) { t.types = {} }
  for (let key in val) {
    let prop = val[key]
    if (t.types[key]) {
      t.types[key].set(prop, stamp)
    } else {
      if (typeof prop !== 'object' || !prop.inherits) {
        if (prop === 'self') {
          prop = t
        } else {
          // same here all needs to be done with special merging

          // same here
          prop = create(getDefault(t), prop, void 0, t)
        }
      }
      t.types[key] = prop
    }
  }
}

const inheritType = t => t.type || t.inherits && inheritType(t.inherits)

// type will be special to sub subvscribe on :/
const type = (t, val, key, stamp) => {
  // here we can do type switching behaviour
  if (typeof val === 'object') {

  } else {
    const type = t.type || inheritType(t)
    if (type) {
      console.log('got type || find in inheritance', type.compute(), 'replace with', val)
      if (type.compute() === val) {
        console.log('same --- ignore', val)
        return
      } else {
        mergeTypesOld(t, val, stamp, type)
      }
    }
    const struct = getType(t, 'struct')
    t.type = create(struct, val, stamp, t, key)
  }
}

const mergeTypesOld = (t, val, stamp, type) => {
  console.log('🤹🎩🤹 MERGE 🤹🎩🤹 ---> ', val)
}

const mergeTypesNew = (parent, type, t, stamp) => {
  const result = getType(parent, type, t)
  if (result) {
    // keys
    if (t._ks || t.val !== void 0) {
      console.log('\n🌊 🤹  have my own MERGE on create 🌊 🌊 ', type, inheritType(t).compute())
      // not neought
      console.log(t._ks, t.val)
    } else {
      // may need to fire for context
      console.log('\n🤡 found a type 🤡  - ', type)
      return result
    }
    return result
  }
}

const createType = (parent, val, t, stamp) => {
  const type = val.type
  t = ( val.reset
    ? getType(parent, type, t)
    : mergeTypesNew(parent, type, t, stamp)
  ) || t
  const instance = new t.Constructor()
  instance.inherits = t
  console.log('merge fun right here! -- so only dont merge when  you use reset true')
  return instance
}

const getType = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent._p && getType(parent._p, type)
  )

export { types, type, createType }
