import { property } from './property'
import { any, composite as anyComposite } from './any'
import root from './root'
import $switch from './switch'
import parent from './parent'

const diff = (t, subs, cb, tree, removed, composite, oRoot) => {
  var changed
  if (composite) {
    for (let key in composite) {
      if (key in tree) {
        const branch = tree[key]
        const c = branch.$c
        if (c) {
          if (key.indexOf('$any') === 0) {
            changed = anyComposite(key, t, subs[key], cb, branch, removed, c, oRoot)
          } else if (parse(key, t, subs, cb, tree, removed, c, oRoot)) {
            changed = true
          }
        } else {
          if (parse(key, t, subs, cb, tree, removed, void 0, oRoot)) {
            changed = true
          }
        }
      }
    }
  } else {
    for (let key in subs) {
      if (key !== 'val' && key !== 'props' && key !== '_' && key !== '$blockRemove' && key !== '$keys') {
        if (parse(key, t, subs, cb, tree, removed, composite, oRoot)) {
          changed = true
        }
      }
    }
  }
  return changed
}

const parse = (key, t, subs, cb, tree, removed, composite, oRoot) => {
  if (key === 'root') {
    return root(t, subs.root, cb, tree, removed, oRoot)
  } else if (key === 'parent') {
    return parent(t, subs.parent, cb, tree, removed, oRoot)
  } else if (key[0] === '$') {
    if (key.indexOf('any') === 1) {
      return any(key, t, subs[key], cb, tree, removed, oRoot)
    } else if (key.indexOf('switch') === 1) {
      return $switch(key, t, subs, cb, tree, removed, composite, oRoot)
    }
  } else {
    return property(key, t, subs[key], cb, tree, removed, composite, oRoot)
  }
}

export { diff, parse }
