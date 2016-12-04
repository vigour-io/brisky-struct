var property, any, root, parent, $switch

//   if (diff(t, subs, cb, branch, tree, void 0, branch.$c)) {

const diff = (t, subs, cb, tree, removed, composite) => {
  if (composite) {
    // console.log('XXXX')
    let changed
    for (let key in composite) {
      if (key === '$any') {
        if (subs.$any && tree.$any) {
          diff(t, subs.$any, cb, tree.$any, removed, composite)
        }
      } else {
        // if (key !== 'val' && key !== 'props' && key !== '_' && key !== '$blockRemove') {
        if (key in tree) {
          if (tree[key].$c) {
            if (key in tree && parse(key, t, subs, cb, tree, removed, tree[key].$c)) {
              changed = true
            }
          } else {
            if (key in tree && parse(key, t, subs, cb, tree, removed)) {
              changed = true
            }
          }
        } else {
          console.log('????')
        }
      }
    }
    return changed
  } else {
    let changed
    for (let key in subs) {
      if (key !== 'val' && key !== 'props' && key !== '_' && key !== '$blockRemove') {
        if (parse(key, t, subs, cb, tree, removed, composite)) {
          changed = true
        }
      }
    }
    return changed
  }
}

const parse = (key, t, subs, cb, tree, removed, composite) => {
  if (key === 'root') {
    return root(t, subs.root, cb, tree, removed)
  } else if (key === 'parent') {
    return parent(t, subs.parent, cb, tree, removed)
  } else if (key[0] === '$') {
    if (key === '$any') {
      return any(t, subs.$any, cb, tree, removed, composite)
    } else if (key.indexOf('$switch') === 0) {
      return $switch(key, t, subs, cb, tree, removed, composite)
    }
  } else {
    return property(key, t, subs[key], cb, tree, removed, composite)
  }
}

exports.diff = diff
exports.parse = parse

property = require('./property').property
any = require('./any')
root = require('./root')
parent = require('./parent')
$switch = require('./switch')
