import { getFn, get } from '../get'
import { getKeys } from '../keys'
import subscription from './subscription'

const strip = (t) => {
  while (t && t.context) {
    t.context = null
    t.contextLevel = null
    t = t._p
  }
}

const updateContext = (context, t, val, stamp, key, resolve, level, j, fn) => {
  if (!(key in context)) {
    let n = j
    if (n) { strip(context) }
    resolve.context = context
    resolve.contextLevel = level
    subscription(context, stamp)
    while (n--) { fn[n](val, stamp, t) }
    if (context._p) {
      if (execContext(t, val, stamp, context._p, context.key, context, 1, j, fn)) {
        context.context = null
        context.contextLevel = null
      }
    }
    if (context.instances) {
      let i = context.instances.length
      while (i--) {
        updateContext(context.instances[i], t, val, stamp, key, resolve, level, j, fn)
      }
    }
    return true
  }
}

const execContext = (t, val, stamp, parent, key, resolve, level, j, fn) => {
  var clear
  if (parent.instances) {
    let i = parent.instances.length
    while (i--) {
      if (updateContext(parent.instances[i], t, val, stamp, key, resolve, level, j, fn)) {
        clear = true
      }
    }
  }
  if (parent._p) {
    if (execContext(t, val, stamp, parent._p, parent.key, resolve, level + 1, j, fn)) {
      clear = true
    }
  }
  return clear
}

const removeContext = (context, key, stamp) => {
  const t = get(context, key)
  if (t) {
    console.log(' r-context:', t.contextLevel)
    // emitRemoveContext(t, key, stamp)
    // const keys = getKeys(t)
    // if (keys) {
    //   for (let i = 0, len = keys.length; i < len; i++) {
    //     // no more parents here
    //     // console.log('--->HUR?')
    //     console.log(' -->')
    //     removeContext(t, keys[i], stamp)
    //   }
    // }
    t.context = null
    t.contextLevel = null
  }
}

// const emitRemoveContext = (t, val, stamp) => {
//   // totally custom handling is what we need
//   // if (t.context) {
//   const context = t.context
//   // console.log('go go go', t.context.path(true))
//   var listeners
//   var i = 0
//   const emitter = onData(t)
//   if (emitter) {
//     listeners = getFn(emitter)
//     i = listeners.length
//     if (listeners) {
//       let n = i
//       while (n--) { listeners[n](null, stamp, t) }
//     }
//   }
//   var x
//   if (t.contextLevel === 1) {
//     x = t._p
//     t._p = context
//   }
//   execContext(t, null, stamp, t._p, t.key, t, 1, i, listeners)
//   if (x) { t._p = x }
// }

export { removeContext, execContext }
