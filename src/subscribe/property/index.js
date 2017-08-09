import { diff } from '../diff'
import remove from './remove'
import { getOrigin } from '../../get'
import { storeContext } from '../../context'
import { puid } from '../../uid'

const store = (t, branch) => {
  if (t._c._c) {
    branch.$stored = storeContext(t._c)
  }
  branch.$tc = t._c
  if (t._cLevel > 1) {
    branch.$tcl = t._cLevel
  }
}

const dummy = 0

const switchuid = t => {
  var uid = 5381
  while (t && t.val && typeof t.val === 'object' && t.val.inherits) {
    t = t.val
    uid * 33 ^ puid(t)
  }
  return uid >>> 0
}

const update = (key, t, subs, cb, tree, c, parent, oRoot) => {
  var branch = tree[key]
  var changed
  if (t) {
    const stamp = t.tStamp || dummy
    if (!branch) {
      branch = tree[key] = { _p: parent || tree, _key: key, $t: t }
      branch.$ = stamp
      if (t._c) { store(t, branch) }
      if (subs.val) {
        if (subs.val === 'shallow') {
          branch.$s = t.stamp
        }
        cb(t, 'new', subs, branch)
        changed = true
      }
      changed = diff(t, subs, cb, branch, void 0, void 0, oRoot) || changed
    } else if (branch.$ !== stamp || branch.$t !== t || branch.$tc != t._c) { //eslint-disable-line
      if (subs.val) {
        if (subs.val === 'shallow') {
          const $s = t.stamp
          if (branch.s$ !== $s || branch.$t !== t) {
            branch.s$ = $s
            changed = true
            cb(t, 'update', subs, branch)
          }
        } else if (
          // will become parsed -- with intergers -- also switcgh returns will be parsed
          subs.val === true ||
          (subs.val === 'switch' && (
            branch.$t !== t ||
            // (delete / void 0 field later)
            branch.$tc != t._c || // eslint-disable-line
            (t.val && typeof t.val === 'object' && t.val.inherits && branch.$val !== switchuid(t)) ||
            branch.$val // means removed reference
          ))
        ) {
          changed = true
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
      if (subs.val === 'switch') {
        if ((t.val && typeof t.val === 'object' && t.val.inherits)) {
          branch.$val = switchuid(t)
        } else if (branch.$val) {
          delete branch.$val
        }
      }
      changed = diff(t, subs, cb, branch, void 0, c, oRoot) || changed
    } else if (branch.$c) {
      // console.log('go $c!', branch.$)
      if (diff(t, subs, cb, branch, void 0, branch.$c, oRoot)) {
        changed = true // cover this
        // shallow hack
        // maybe add switch as well?
        if (subs.val === true || subs.val === 'shallow') {
          cb(t, 'update', subs, branch)
        }
      }
    }
  } else if (branch) {
    changed = remove(subs, cb, branch, oRoot) || (subs.val && true)
  }
  return changed
}

const property = (key, t, subs, cb, tree, removed, composite, oRoot) => {
  var changed
  if (removed) {
    const branch = tree[key]
    if (branch) {
      changed = remove(subs, cb, branch, oRoot) || (subs.val && true)
    }
  } else {
    // right here lets go clean
    // t._c
    t = getOrigin(t, key)
    changed = update(
      key,
      t,
      subs,
      cb,
      tree,
      composite,
      void 0,
      oRoot
    )
  }
  return changed
}

export { property, update }
