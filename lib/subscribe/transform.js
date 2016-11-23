const { diff } = require('./diff')
const remove = require('./property/remove')
// maybe dont need to care about removed? o yeah but you do

const driver = (t, type) => {
  // console.log('---->', t.path(), type)
}

const driverChange = (key, tkey, t, subs, cb, tree, removed) => {
  const branch = tree[key]
  if (branch && (removed || !t)) {
    console.log('remove driver -- what to do?')
    remove(subs, cb, branch)
    // update = (t, subs, cb, tree, removed)
    // but also remove the simple of course
  } else if (diff(t, subs, driver, branch, removed)) {
    return simple(tkey, t, subs, cb, tree, removed, subs.val, false)
  }
}

const $transform = (key, t, subs, cb, tree, removed) => {
  var transform = subs[key]
  if (!transform) {
    let tkey = key.slice(0, -1) // this means from composite
    driverChange(key, tkey, t, subs[tkey], cb, tree, removed)
  } else {
    if (transform.val) {
      let dKey = key + '*'
      let driverBranch = tree[dKey]
      if (driverBranch) {
        if (diff(t, transform, driver, driverBranch, removed)) {
          return simple(key, t, subs, cb, tree, removed, transform.val, true)
        } else {
          const branch = tree[key]
          if (branch) {
            update(t, branch.$subs, cb, branch, removed)
          }
        }
      } else if (!driverBranch) {
        create(dKey, t, transform, driver, tree)
        return simple(key, t, subs, cb, tree, removed, transform.val, true)
      }
    } else {
      return simple(key, t, subs, cb, tree, removed, transform, true)
    }
  }
}

const create = (key, t, subs, cb, tree) => {
  const branch = tree[key] = { _p: tree, _key: key, $subs: subs }
  return diff(t, subs, cb, branch)
}

const simple = (key, t, subs, cb, tree, removed, transform, diffit) => {
  var branch = tree[key]
  const result = transform(t, subs, tree, key)
  if (!result) {
    if (branch) {
      remove(branch.$subs, cb, branch)
      return true
    }
  } else {
    if (!branch) {
      create(key, t, result, cb, tree)
      return true
    } else if (isSwitched(branch.$subs, result)) {
      console.log('switched RESULTS')
      remove(branch.$subs, cb, branch)
      create(key, t, result, cb, tree)
      return true
    } else if (diffit) {
      return update(t, result, cb, branch, removed)
    }
  }
}

const update = (t, subs, cb, tree, removed) => {
  if (!t || removed) {
    remove(tree.$subs, cb, tree)
    return true
  } else {
    return diff(t, subs, cb, tree, removed)
  }
}

const isSwitched = (a, b) => {
  console.log('?', a, b)
  // will make a fast one for this -- maybe adding keys in here
  if (a == b) { // eslint-disable-line
    return false
  } else {
    for (let key in a) {
      console.log(key)
      if (key !== 'props' && key !== '_') {
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
    }
  }
}

module.exports = $transform
