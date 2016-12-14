var property, any, root, parent, $switch, anyComposite

const diff = (t, subs, cb, tree, removed, composite) => {
  var changed
  if (composite) {
    for (let key in composite) {
      if (key in tree) {
        let branch = tree[key]
        let c = branch.$c
        if (c) {
          if (key.indexOf('$any') === 0) {
            changed = anyComposite(key, t, subs[key], cb, branch, removed, c)
          } else if (parse(key, t, subs, cb, tree, removed, c)) {
            changed = true
          }
        } else {
          if (parse(key, t, subs, cb, tree, removed)) {
            changed = true
          }
        }
      }
    }
  } else {
    for (let key in subs) {
      if (key !== 'val' && key !== 'props' && key !== '_' && key !== '$blockRemove' && key !== '$keys') {
        if (parse(key, t, subs, cb, tree, removed, composite)) {
          changed = true
        }
      }
    }
  }
  return changed
}

const parse = (key, t, subs, cb, tree, removed, composite) => {
  if (key === 'root') {
    return root(t, subs.root, cb, tree, removed)
  } else if (key === 'parent') {
    return parent(t, subs.parent, cb, tree, removed)
  } else if (key[0] === '$') {
    if (key.indexOf('any') === 1) {
      return any(key, t, subs[key], cb, tree, removed, composite)
    } else if (key.indexOf('switch') === 1) {
      return $switch(key, t, subs, cb, tree, removed, composite)
    }
  } else {
    return property(key, t, subs[key], cb, tree, removed, composite)
  }
}

export { diff, parse }

import { property as prop } from './property'
import { any as a, composite as c } from './any'
import r from './root'
import p from './parent'
import s from './switch'

property = prop
any = a
anyComposite = c
root = r
parent = p
$switch = s
