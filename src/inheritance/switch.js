import { getKeys } from '../keys'
import { get } from '../get'
import { getProp } from '../property'

const getProps = t => t.props || getProps(t.inherits)

const props = (t, inherits) => {
  if (t.props) {
    let hasOwn
    for (let key in t.props) {
      const prop = getProp(inherits, key)
      if (!prop || t.props[key].struct != prop.struct) { // eslint-disable-line
        if (!hasOwn) hasOwn = {}
        if (t.props[key].struct) {
          hasOwn[key] = t.props[key]
        } else {
          // cannot change fn
        }
      }
    }
    return hasOwn
  }
}

// emitters -- fix it

const switchInheritance = (t, inherits, stamp) => {
  var inheritsKeys, keys
  const old = t.inherits
  const instances = old.instances
  const tProps = props(t, old)
  t.inherits = inherits

  if (tProps) {
    console.log('has own property', tProps)
    for (let key in tProps) {
      console.log('   own prop need to do something', key)
      if (key in t) {
        console.log('     has the key - prop do something!', key)
      }
    }
  }

  if (t._ks && (inheritsKeys = getKeys(inherits))) {
    if (!keys) keys = []
    for (let i = 0, len = inheritsKeys.length; i < len; i++) {
      const key = inheritsKeys[i]
      if (!(key in t)) keys.push(key)
    }

    for (let i = 0, len = t._ks.length; i < len; i++) {
      const key = t._ks[i]
      if (key in t) {
        keys.push(key)
        if (get(inherits, key, true)) {
          console.log('👹 lets resolve inheritance!', `"${key}"`)
          const prop = getProp(t, key)

          if (tProps && tProps[key]) {
            console.log('HAS OWN PROP - but from inheritance... - mystery case')
          }

          if (prop.struct) {
            console.log('   --- lets resolve! ---', key)
          } else {
            console.log('  PROPS ON NEW INHERITANCE IS NOT A STRUCT -- nto supported yet')
          }
        }
      }
    }
    t._ks = keys
  }

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
