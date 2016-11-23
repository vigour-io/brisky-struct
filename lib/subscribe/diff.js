var property, any, root, parent

const diff = (t, subs, cb, tree, removed) => {
  var changed
  for (let key in subs) {
    // key === '$' // remove _ add it to props
    if (key !== 'val' && key !== 'props') { // key !== '$remove' this will become special
      changed = parse(key, t, subs, cb, tree, removed)
    }
  }
  return changed
}

// only place where you have to parse shit
const parse = (key, t, subs, cb, tree, removed) => {
  if (key === 'root') {
    return root(t, subs.root, cb, tree, removed)
  } else if (key === 'parent') {
    return parent(t, subs.parent, cb, tree, removed)
  } else if (key[0] === '$') {
    if (key === '$any') {
      // maybe make this with a start as well for parse functions
      return any(t, subs.$any, cb, tree, removed)
    } else {
      // match it better / stronger
      return $transform(key, t, subs, cb, tree, removed)
    }
  } else {
    return property(key, t, subs[key], cb, tree, removed)
  }
}

exports.diff = diff
exports.parse = parse

property = require('./property')
any = require('./any')
root = require('./root')
parent = require('./parent')

// maybe dont need to care about removed? o yeah but you do

const isSwitched = (a, b) => {
  if (a === b) {
    return false
  } else {
    for (let key in a) {
      if (key !== 'props' && key !== '_') {
        if (a[key] !== b[key]) {
          if (typeof a[key] === 'function' && typeof b[key] === 'function') {
            if (a[key].toString() !== b[key].toString()) {
              return true
            }
          } else if (typeof a[key] !== 'object' || (typeof b[key] === 'object' && isSwitched(a[key], b[key]))) {
            return true
          }
        }
      }
    }
  }
}

const $transform = (key, t, subs, cb, tree, removed) => {
  if (!subs.props) { subs.props = {} } // add this in parse
  const transform = subs[key]
  var branch = tree[key]
  const result = transform(t, subs, tree, key)
  if (!result) {
    if (branch) {
      diff(t, result, cb, branch, true)
    }
  } else {
    if (!branch) {
      console.log('new')
      create(key, t, result, cb, tree)
      return true
    } else if (isSwitched(branch.$subs, result)) {
      console.log('switched')
      diff(t, branch.$subs, cb, branch, true)
      create(key, t, result, cb, tree)
      return true
    } else {
      console.log('update')
      return diff(t, result, cb, branch, removed)
    }
  }
}

const create = (key, t, subs, cb, tree) => {
  const branch = tree[key] = { _p: tree, _key: key, $subs: subs }
  return diff(t, subs, cb, branch)
}
