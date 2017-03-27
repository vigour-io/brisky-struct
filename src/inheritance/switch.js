import { getKeys } from '../keys'
import { get } from '../get'
import { getProp } from '../property'

const getProps = t => t.props || getProps(t.inherits)

const props = (t, inherits) => {
  if (t.props) {
    let hasOwn
    for (let key in t.props) {
      // what todo when a prop is a function from inheritance but not on the new thing>?
      const prop = getProp(inherits, key)
      if (!prop || t.props[key] != prop) { // eslint-disable-line
        if (!hasOwn) hasOwn = {}
        hasOwn[key] = prop
      }
    }
    return hasOwn
  }
}

const switchInheritance = (t, inherits, stamp) => {
  var inheritsKeys
  const old = t.inherits
  const instances = old.instances
  const tProps = props(t, old)

  t.inherits = inherits

  if (t._ks && (inheritsKeys = getKeys(inherits))) {
    // merge keys arrays
    const keys = []

    for (let i = 0, len = inheritsKeys.length; i < len; i++) {
      const key = inheritsKeys[i]
      if (!(key in t)) keys.push(key)
    }

    if (tProps) {
      // lets redo it
      console.log('has own property', tProps)
    }

    for (let i = 0, len = t._ks.length; i < len; i++) {
      const key = t._ks[i]
      if (key in t) {
        keys.push(key)
        // now you need to resolve inheritance
        if (get(inherits, key, true)) { // not enough need to know if key is in the inheritance chain
          console.log('👹 lets resolve inheritance!', `"${key}"`)
          const prop = getProp(t, key)
          // need to see if its own props not inherited
          let hasOwn = tProps && tProps[key]
          // also for props need to change inheritance
          // so diffuclty piece is -- get
          // create a list of own props -- each own prop has to
          if (hasOwn) {
            console.log('HAS OWN PROP')
          } else {
            console.log('--- lets resolve! ---')
            if (prop.struct) {

            } else {
              console.log('prop on new inheritance is different....')
            }
          }
          // (t, val, key, stamp, struct)
          // switchInheritance()
          // also need to do deep -- needs to be recursive
        }
      }
    }

    t._ks = keys
  }

  // also need to remove shit if it inherits somehting else
  // remove instance
  if (instances) {
    let i = instances.length
    while (i--) {
      if (instances[i] === t) {
        instances.splice(i, 1)
        break
      }
    }
  }
}

export default switchInheritance
