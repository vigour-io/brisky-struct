import { diff } from '../diff'
import remove from './remove'
import { getOrigin } from '../../get'
import { storeContext } from '../../context'

const store = (t, branch) => {
  if (t.context.context) {
    branch.$stored = storeContext(t.context)
  }
  branch.$tc = t.context
  if (t.contextLevel > 1) {
    branch.$tcl = t.contextLevel
  }
}

const update = (key, t, subs, cb, tree, c, parent) => {
  var branch = tree[key]
  var changed
  if (t) {
    const stamp = t.tStamp || 0 // needs to use stamp as well (if dstamp is gone)
    if (!branch) {
      branch = tree[key] = { _p: parent || tree, _key: key, $t: t }
      branch.$ = stamp
      if (t.context) { store(t, branch) }
      if (subs.val) { cb(t, 'new', subs, branch) }
      diff(t, subs, cb, branch, void 0, c)
      changed = true
    } else if (branch.$ !== stamp || branch.$t !== t || branch.$tc !== t.context) {
      if (subs.val) {
        if (subs.val === true || branch.$t !== t) { // needs more opt!
          cb(t, 'update', subs, branch)
        }
      }

      branch.$ = stamp
      if (t.context) {
        store(t, branch)
      } else if (branch.$t.context) {
        delete branch.$tc
        if (branch.$tcl) {
          delete branch.$tcl
        }
        if (branch.$stored) {
          delete branch.$stored
        }
      }
      branch.$t = t

      diff(t, subs, cb, branch, void 0, c)
      changed = true
    } else if (branch.$c) {
      if (diff(t, subs, cb, branch, void 0, branch.$c)) {
        changed = true // cover this
      }
      if (changed && subs.val === true) { cb(t, 'update', subs, branch) }
    }
  } else if (branch) {
    remove(subs, cb, branch)
    changed = true
  }
  return changed
}

const property = (key, t, subs, cb, tree, removed, composite) => {
  var changed
  if (removed) {
    const branch = tree[key]
    if (branch) {
      remove(subs, cb, branch)
      changed = true
    }
  } else {
    t = getOrigin(t, key)
    changed = update(
      key,
      t,
      subs,
      cb,
      tree,
      composite
    )
    if (t && t.context) {
      t.contextLevel = null
      t.context = null
    }
  }
  return changed
}

export { property, update }
