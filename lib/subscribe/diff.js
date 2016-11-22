var property, any, root, parent

const diff = (t, subs, cb, tree, removed) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_') { // key !== '$remove' this will become special
      changed = parse(key, t, subs, cb, tree, removed)
    }
  }
  return changed
}

// only place where you have to parse shit
const parse = (key, t, subs, cb, tree, removed) => {
  if (key === 'root') {
    return root(t, subs.root, cb, tree, removed)
  } else if (key === '$any') {
    return any(t, subs.$any, cb, tree, removed)
  } else if (key === 'parent') {
    return parent(t, subs.parent, cb, tree, removed)
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
