import { set } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import { getVal } from './get'
import getApi from './get/api'
import { removeKey } from './keys'

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

const removeReference = t => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
}

const getOnProp = t => t.props && t.props.on || getOnProp(t.inherits)

const onContext = (t, context) => {
  if (t.emitters) {
    if (context) {
      t.emitters._c = context
      t.emitters._cLevel = 1
    }
  } else if (t.inherits) {
    onContext(t.inherits, context || t)
  }
}

const updateInstance = (t, val) => {
  // console.log('UPDATING', t.key, '->', val.key, getRoot(t).key, '->', getRoot(val).key, '->')
  listener(t.val.emitters.data, null, uid(t))
  if (t.instances) {
    updateInstances(t, val)
  }
  t.val = val
  if (val.emitters) {
    if (!val.emitters.data) {
      getOnProp(val)(val, { data: void 0 }, 'on')
    }
    listener(val.emitters.data, t, uid(t))
  } else {
    onContext(val)
    getOnProp(val)(val, { data: void 0 }, 'on')
    listener(val.emitters.data, t, uid(t))
  }
}

const updateInstances = (t, val, override) => {
  let i = t.instances.length
  while (i--) {
    const instance = t.instances[i]
    if (override) {
      instance.inherits = override
    } else {
      override = t
    }
    if (instance.val) {
      if (instance.val.inherits === getVal(t)) {
        let vinstance
        if (val.instances) {
          const iRoot = getRoot(instance)
          let j = val.instances.length
          while (j--) {
            if (getRoot(val.instances[j]) === iRoot) {
              vinstance = val.instances[j]
              updateInstance(instance, vinstance)
              break
            }
          }
        }
        if (!vinstance) {
          // console.log('DELETING', getRoot(instance).key, instance.key)
          listener(instance.val.emitters.data, null, uid(instance))
          if (instance._ks) {
            if (instance.instances) {
              updateInstances(instance, val)
            }
            delete instance.val
          } else {
            if (instance.instances) {
              updateInstances(instance, val, override)
            }
            t.instances.splice(i, 1)
            delete instance._p[instance.key]
            removeKey(instance._p, instance.key)
          }
        }
      }
    } else if (instance.instances) {
      updateInstances(instance, val)
    }
  }
}

const doesInherit = (t, r) => t === r || (t.inherits && doesInherit(t.inherits, r))

// Get local root
const getRoot = t => {
  while (t._p) {
    t = t._p
  }
  return t
}

// Get local root and path
const getRootPath = (t, path) => {
  while (t._p) {
    path.unshift(t.key)
    t = t._p
  }
  return t
}

const resolveReferences = (t, instance, stamp) => {
  const iRoot = getRoot(instance)
  const refs = t.emitters.data.struct
  var i = refs.length
  while (i--) {
    const rPath = []
    const rRoot = getRootPath(refs[i], rPath)
    if (doesInherit(iRoot.inherits, rRoot)) {
      // console.log('ADDING', refs[i].key, '->', instance.key, rRoot.key, '->', iRoot.key)
      set(getApi(iRoot, rPath, {}), instance, stamp)
    }
  }
}

const resolveFromValue = (t, val, stamp) => {
  if (val.instances && val._p && t._p) {
    const vRoot = getRoot(val)
    const tPath = []
    const tRoot = getRootPath(t, tPath)
    if (tRoot === vRoot) {
      let i = val.instances.length
      while (i--) {
        const vinstance = val.instances[i]
        // console.log('ADDING', t.key, '->', val.key, vRoot.key, '->', getRoot(vinstance).key)
        const ref = getApi(getRoot(vinstance), tPath, {})
        if (ref._c) {
          set(ref, vinstance, stamp)
          ref._c = null
          ref._cLevel = null
        }
      }
    }
  }
}

export { reference, removeReference, resolveReferences, resolveFromValue, updateInstances }
