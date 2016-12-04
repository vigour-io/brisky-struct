const { diff } = require('./diff')
const remove = require('./property/remove')
const { update } = require('./property')

const driver = (t, type) => {}

const driverChange = (key, tkey, t, subs, cb, tree, removed, composite) => {
  const branch = tree[key]
  if (diff(t, subs, driver, branch, removed, composite)) {
    return body(tkey, t, subs, cb, tree, removed, subs.val, false, composite)
  }
}

const $switch = (key, t, subs, cb, tree, removed, composite) => {
  var $switch = subs[key]
  if (!$switch) {
    let tkey = key.slice(0, -1) // this means from composite
    driverChange(key, tkey, t, subs[tkey], cb, tree, removed, composite)
  } else {
    if ($switch.val) {
      let dKey = key + '*'
      let driverBranch = tree[dKey]
      if (driverBranch) {
        if (diff(t, $switch, driver, driverBranch, removed, composite)) {
          return body(key, t, subs, cb, tree, removed, $switch.val, true, composite)
        } else {
          const branch = tree[key]
          if (branch) { update(key, t, branch.$subs, cb, tree, removed, composite) }
        }
      } else if (!driverBranch) {
        create(dKey, t, $switch, driver, tree, composite)
        return body(key, t, subs, cb, tree, removed, $switch.val, true, composite)
      }
    } else {
      return body(key, t, subs, cb, tree, removed, $switch, true, composite)
    }
  }
}

const create = (key, t, subs, cb, tree, composite) => {
  const branch = tree[key] = { _p: tree, _key: key, $subs: subs }
  return diff(t, subs, cb, branch, void 0, composite)
}

const body = (key, t, subs, cb, tree, removed, $switch, diffit, composite) => {
  var result
  if (!removed && t) { result = $switch(t, subs, tree, key) }
  var branch = tree[key]
  if (!result) {
    if (branch) {
      remove(branch.$subs, cb, branch)
      return true
    }
  } else {
    if (!branch) {
      update(key, t, result, cb, tree, void 0, composite)
      tree[key].$subs = result
      return true
    } else if (isSwitched(branch.$subs, result)) {
      remove(branch.$subs, cb, branch)
      update(key, t, result, cb, tree, void 0, composite)
      tree[key].$subs = result
      return true
    } else if (diffit) {
      return update(key, t, result, cb, tree, removed, composite)
    }
  }
}

const isSwitched = (a, b) => {
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
        } else if (typeof a[key] !== 'object' || typeof b[key] !== 'object' || isSwitched(a[key], b[key])) {
          return true
        }
      }
    }
    for (let key in b) {
      if (key !== 'props' && !a[key]) { return true }
    }
  }
}

module.exports = $switch
