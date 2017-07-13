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
  // console.log(t.key, val.get(['root', 'k', 'compute']), '->', t.get(['root', 'k', 'compute']), val.key)
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
    // console.log('CHECKING', instance.get(['root', 'k', 'compute']), instance.key)
    if (instance.val) {
      if (instance.val.inherits === getVal(t)) {
        let vinstance
        if (val.instances) {
          // console.log('VINSTANCES', instance.get(['root', 'k', 'compute']), instance.key)
          const iRoot = getRoot(instance)
          let j = val.instances.length
          while (j--) {
            if (getRoot(val.instances[j]) === iRoot) {
              // console.log('VINSTANCE', instance.get(['root', 'k', 'compute']), val.instances[j])
              vinstance = val.instances[j]
              updateInstance(instance, vinstance)
              break
            }
          }
        }
        if (!vinstance) {
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
          // console.log('DELETING', instance.get(['root', 'k', 'compute']), instance.key)
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
      // console.log('*ADDING', refs[i].key, '->', instance.key, refs[i].get(['root', 'k', 'compute']), '->', instance.get(['root', 'k', 'compute']))
      set(getApi(iRoot, rPath, {}), instance, stamp)
    }
  }
}

const resolveFromValue = (t, val, stamp) => {
  if (val.instances && val._p && t._p) {
    const vPath = []
    const vRoot = getRootPath(val, vPath)
    const tPath = []
    const tRoot = getRootPath(t, tPath)
    const rootInstances = vRoot.instances
    if (rootInstances && tRoot === vRoot) {
      let i = rootInstances.length
      while (i--) {
        const field = getApi(rootInstances[i], vPath, void 0, void 0, true)
        if (field !== val) {
          // console.log('ADDING', t.key, '->', field.key, vRoot.get(['k', 'compute']), '->', rootInstances[i].get(['k', 'compute']))
          const instance = getApi(rootInstances[i], tPath)
          if (instance && getVal(instance) === val) {
            set(instance, field, stamp)
          }
          instance._c = null
          instance._cLevel = null
        }
        field._c = null
        field._cLevel = null
      }
    }
  }
}

export { reference, removeReference, resolveReferences, resolveFromValue, updateInstances }
