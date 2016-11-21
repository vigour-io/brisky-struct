var property, any, root

const diff = (t, subs, cb, tree, removed, referenced, previous) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_') { // key !== '$remove' this will become special
      parse(key, t, subs, cb, tree, removed, referenced, previous)
    }
  }
  return changed
}

const parse = (key, t, subs, cb, tree, removed, referenced, previous) => {
  if (key === 'root') {
    return root(t, subs.root, cb, tree, removed, referenced, previous)
  } else if (key === '$any') {
    return any(t, subs.$any, cb, tree, removed, referenced, previous)
  } else {
    return property(key, t, subs[key], cb, tree, removed, referenced, previous)
  }
}

exports.diff = diff
exports.parse = parse

property = require('./property')
any = require('./any')
root = require('./root')
