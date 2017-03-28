import { getKeys } from '../keys'
import { get, getProps } from '../get'
import { getProp } from '../property'

const getKeyProp = (t, key) => t.props
  ? key && (key in t.props && t.props[key])
  : getKeyProp(t.inherits, key)

const props = (t, inherits) => {
  if (t.props) {
    let own
    for (let key in t.props) {
      const prop = getProp(inherits, key)
      if (!prop || t.props[key].struct != prop.struct) { // eslint-disable-line
        if (!own) own = {}
        own[key] = t.props[key]
      }
    }
    return own
  }
}

const switchInheritance = (t, inherits) => {
  // if (t.inherits === inherits) { // this opt can go later need to check deep inherits
  //   return
  // }

  var inheritsKeys, keys
  const old = t.inherits
  const instances = old.instances
  const tProps = props(t, old)
  t.inherits = inherits

  if (tProps) {
    const previous = getProps(inherits)
    const props = t.props = {}
    for (let key in previous) {
      props[key] = previous[key]
    }
    for (let key in tProps) {
      if (tProps[key].struct) {
        switchInheritance(tProps[key].struct, (getKeyProp(t, key) || tProps.default || getProp(t, key)).struct)
        props[key] = tProps[key]
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
        const prop = getProp(t, key)
        if (prop.struct) {
          switchInheritance(t[key], get(inherits, key, true) || prop.struct)
        } else {
          console.log('  PROPS ON NEW INHERITANCE IS NOT A STRUCT -- switch not supported yet', key)
        }
      }
    }
    t._ks = keys
    console.log(keys)
  }

  if (inherits !== old) {
    if (instances) {
      let i = instances.length
      while (i--) {
        if (instances[i] === t) {
          instances.splice(i, 1)
          break
        }
      }
    }
    if (inherits.instances !== false) {
      if (!inherits.instances) inherits.instances = []
      inherits.instances.push(t)
    }
  }

  // also need to take care of EMITTERS

  // waaay more complex...
  // if (t.instances) {
  //   for (let i = 0, len = t.instances.length; i < len; i++) {
  //     switchInheritance(t.instances[i], t)
  //   }
  // }

}

export default switchInheritance
