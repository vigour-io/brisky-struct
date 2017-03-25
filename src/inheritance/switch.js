import { getKeys } from '../keys'

// const removeContextKey = (t, key) => { -- may need to use this

// this is it for now
const switchInheritance = (t, inherits, stamp) => {
  var inheritsKeys
  if (t._ks && (inheritsKeys = getKeys(inherits))) {
    // merge keys arrays
    const keys = []

    for (let i = 0, len = inheritsKeys.length; i < len; i++) {
      const key = inheritsKeys[i]
      if (key in t) {
        console.log('have this key - do nested merging', `"${key}"`)
        // have to do some special shit -- merge deep for example
      } else {
        keys.push(key)
      }
    }

    for (let i = 0, len = t._ks.length; i < len; i++) {
      const key = t._ks[i]
      if (key in t) {
        keys.push(key)
        // now you need to resolve inheritance
        if (key in inherits) {
          console.log('👹 lets resolve inheritance!', `"${key}"`)
          // also need to do deep -- needs to be recursive
        }
      }
    }

    t._ks = keys
  }
  // also need to remove shit if it inherits somehting else

  // remove instance
  const instances = t.inherits.instances
  if (instances) {
    let i = instances.length
    while (i--) {
      if (instances[i] === t) {
        instances.splice(i, 1)
        break
      }
    }
  }

  t.inherits = inherits
}

export default switchInheritance
