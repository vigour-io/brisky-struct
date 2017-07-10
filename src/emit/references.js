import { getFn, getData } from '../get'
import { root, path } from '../traversal'
import getApi from '../get/api'

const fn = (ref, t, val, stamp) => {
  const emitter = getData(ref)
  if (emitter) {
    const listeners = getFn(emitter)
    if (listeners) {
      let i = listeners.length
      while (i--) {
        listeners[i](val, stamp, t)
      }
      let clear = t
      while (clear && clear._c) {
        clear._c = null
        clear._cLevel = null
        clear = clear._p
      }
    } else {
      emitter.listeners = []
    }
  }
}

// dont know if this is enough....
const equalInherit = (t, r) => t.inherits && (t.inherits === r || equalInherit(t.inherits, r))

const iterate = (refs, val, stamp, orig, rootT) => {
  if (refs) {
    let s
    let i = refs.length
    while (i--) {
      let p = refs[i]
      let rRoot = p
      let path = []
      while (p) {
        path.push(rRoot.key)
        rRoot = p
        p = p._p
      }
      if (rRoot) {
        // this is stu[id]
        let t = s || (s = root(orig, true))
        let j = path.length
        let prev = t
        while (j--) {
          prev = t
          t = t[path[j]]
          if (!t) {
            if (rRoot === rootT || equalInherit(rRoot, rootT)) {
              const ref = refs[i]
              ref._c = prev
              ref._cLevel = j + 1
              fn(ref, ref, val, stamp)
              let localRefs = ref.emitters &&
                ref.emitters.data &&
                ref.emitters.data.struct
              iterate(localRefs, val, stamp, orig, rootT)
              context(refs[i], val, stamp, orig)
            }
            break
          }
        }
      }
    }
  }
}

const context = (t, val, stamp, orig) => {
  if (t.inherits) {
    const contextRefs = t.inherits &&
      t.inherits.emitters &&
      t.inherits.emitters.data &&
      t.inherits.emitters.data.struct
    iterate(contextRefs, val, stamp, orig, root(t.inherits, true))
    context(t.inherits, val, stamp, orig)
  }
}

export default context
