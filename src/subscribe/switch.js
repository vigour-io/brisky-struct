import { diff } from './diff'
import remove from './property/remove'
import { update } from './property'
import { origin } from '../compute'

const compositeDriverChange = (key, tkey, t, subs, cb, tree, removed, composite, oRoot) => {
  const branch = tree[key]
  if (diff(t, subs, cb, branch, removed, composite, oRoot)) {
    return body(tkey, t, subs, cb, tree, removed, subs.val, false, composite, oRoot)
  }
}

const $switch = (key, t, subs, cb, tree, removed, composite, oRoot) => {
  var $switch = subs[key]
  if (!$switch) {
    const tkey = key.slice(0, -1) // this means from composite
    compositeDriverChange(key, tkey, t, subs[tkey], cb, tree, removed, composite, oRoot)
  } else {
    if ($switch.val) {
      const dKey = key + '*'
      const driverBranch = tree[dKey]
      if (driverBranch) {
        if (diff(t, $switch, cb, driverBranch, removed, composite, oRoot)) {
          return body(key, t, subs, cb, tree, removed, $switch.val, true, composite, oRoot)
        } else {
          const branch = tree[key]
          if (branch) { update(key, t, branch.$subs, cb, tree, composite, void 0, oRoot) }
        }
      } else if (!driverBranch) {
        if (create(dKey, t, $switch, cb, tree, oRoot)) {
          return body(key, t, subs, cb, tree, removed, $switch.val, true, composite, oRoot)
        }
      }
    } else {
      return body(key, t, subs, cb, tree, removed, $switch, true, composite, oRoot)
    }
  }
}

const create = (key, t, subs, cb, tree, oRoot) => {
  const branch = tree[key] = {
    _p: tree,
    _key: key,
    $subs: subs
  }
  return diff(t, subs, cb, branch, void 0, void 0, oRoot)
}

const body = (key, t, subs, cb, tree, removed, localSwitch, diffIt, composite, oRoot) => {
  var result
  if (!removed && t) { result = localSwitch(t, subs, tree, key) }
  var branch = tree[key]
  if (!result) {
    if (branch) {
      remove(branch.$subs, cb, branch, oRoot)
      return true
    }
  } else {
    if (!branch) {
      update(key, t, result, cb, tree, void 0, void 0, oRoot)
      branch = tree[key]
      branch.$subs = result
      branch.$origin = origin(t)
      return true
    } else if (isSwitched(branch.$subs, result, branch, t, oRoot)) {
      remove(branch.$subs, cb, branch, oRoot)
      update(key, t, result, cb, tree, void 0, void 0, oRoot)
      branch = tree[key]
      branch.$subs = result
      branch.$origin = origin(t)
      return true
    } else if (diffIt) {
      return update(key, t, result, cb, tree, composite, void 0, oRoot)
    }
  }
}

const isSwitched = (a, b, branch, t, oRoot) => {
  if (t) {
    // here we need to special origin
    const o = origin(t)
    const b = branch.$origin
    if (b !== o) {
      branch.$origin = o
      return true
    }
  }
  if (a === b) {
    return false // test
  } else {
    if (a._) {
      return a._ !== b._
    }
    for (let key in a) {
      if (a[key] !== b[key]) {
        if (typeof a[key] === 'function' && typeof b[key] === 'function') {
          if (a[key].toString() !== b[key].toString()) {
            return true
          }
        } else if (typeof a[key] !== 'object' || typeof b[key] !== 'object' || isSwitched(a[key], b[key], void 0, void 0, oRoot)) {
          return true
        }
      }
    }
    for (let key in b) {
      if (key !== 'props' && !a[key]) { return true }
    }
  }
}

export default $switch
