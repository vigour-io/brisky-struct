import { getKeys } from '../keys'

// const removeContextKey = (t, key) => { -- may need to use this

// this is it for now
const switchInheritance = (t, inherits, stamp) => {
  var inheritsKeys
  if (t._ks && (inheritsKeys = getKeys(inherits))) {
    // merge keys arrays
    const keys = []
    let i = t._ks.length
    while (i--) {
      const key = t._ks[i]
      if (key in t) {
        keys.unshift(key)
        // now you need to resolve inheritance
        if (key in inherits) {
          console.log('lets resolve inheritance!')
          // also need to do deep -- needs to be recursive
        }
      }
    }

    let j = inheritsKeys.length
    while (j--) {
      if (inheritsKeys[j] in t) {
        console.log('have this key - do nested merging', inheritsKeys[j])
        // have to do some special shit -- merge deep for example
      } else {
        keys.unshift(inheritsKeys[j])
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
