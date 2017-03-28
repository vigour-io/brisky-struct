import { set, create } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import { get } from './get'
import getApi from './get/api'
import { root, path } from './traversal'

const resolveReferences = (t, instance, stamp) => {
  const listeners = t.emitters.data.struct
  const tRoot = root(t, true)
  var iRoot
  let i = listeners.length
  while (i--) {
    if (root(listeners[i], true) === tRoot) {
      if (!iRoot) iRoot = root(instance, true)
      if (iRoot !== tRoot) {
        const p = path(listeners[i], true)
        if (p[0] === tRoot.key) p.shift()
        let travel = iRoot
        if (p.length) {
          for (let i = 0, len = p.length; i < len; i++) {
            let key = p[i]
            travel[key] = travel[key] || create(get(travel, key, true), void 0, stamp, travel, key)
            travel = travel[key]
          }
        }
        set(travel, instance, stamp)
      }
    }
  }
}

const removeReference = t => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
}

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

export { resolveReferences, removeReference, reference }
