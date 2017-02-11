import { diff } from '../diff'
import remove from './remove'
import { getOrigin } from '../../get'
import { storeContext } from '../../context'

const store = (t, branch) => {
  if (t._c._c) {
    branch.$stored = storeContext(t._c)
  }
  branch.$tc = t._c
  if (t._cLevel > 1) {
    branch.$tcl = t._cLevel
  }
}

const dummy = [ 0 ]

const update = (key, t, subs, cb, tree, c, parent) => {
  var branch = tree[key]
  var changed
  if (t) {
    const stamp = t.tStamp || dummy  // needs to use stamp as well (if dstamp is gone)
    if (!branch) {
      branch = tree[key] = { _p: parent || tree, _key: key, $t: t }
      branch.$ = stamp
      if (t._c) { store(t, branch) }
      if (subs.val) { cb(t, 'new', subs, branch) }
      diff(t, subs, cb, branch, void 0, c)
      changed = true
      // ! && ! || !== (thats why != may need to replace)
    } else if (branch.$ !== stamp || branch.$t !== t || branch.$tc != t._c) { //eslint-disable-line
      if (subs.val) {
        if (
          // will become parsed -- with intergers -- also switcgh returns will be parsed
          subs.val === true ||
          subs.val === 'shallow' ||
          (subs.val === 'switch' && (branch.$t !== t || branch.$tc != t._c)) //eslint-disable-line
        ) {
          cb(t, 'update', subs, branch)
        }
      }

      branch.$ = stamp

      if (t._c) {
        store(t, branch)
      } else if (branch.$tc) {
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
      if (changed && (subs.val === true)) { cb(t, 'update', subs, branch) }
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
  }
  return changed
}

export { property, update }
