var property, remove, any

const { get } = require('../get')

const referencedCheck = (t, key, o) => (!(key in t) || t[key] === null) &&
  (typeof t.val !== 'object' || !t.val.inherits || o === t.val || referencedCheck(t.val, key, o || t))

const diff = (t, subs, cb, tree, removed, referenced, previous) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (item(key, t, subs[key], cb, tree, removed, referenced, previous)) {
        changed = true
      }
    }
  }
  return changed
}

const matchReferenced = (t, referenced, branch) => {
  let key = branch._key
  while (referenced) {
    if (referenced === t) {
      return true
    } else if (key in referenced && referenced[key] !== null) {
      return false
    }
    referenced = referenced.val
  }
}

const getPrevious = (t, previous, key) => {
  while (previous) {
    if (previous === t) {
      return get(previous, key)
    }
    previous = previous.val
  }
}

const item = (key, t, subs, cb, tree, removed, referenced, previous) => {
  if (key === 'val') {
    throw new Error('never handle .val in item')
  }

  var changed
  if (key === '$any') {
    any(t, subs, cb, tree, removed, referenced, previous)
  } else {
    if (!referenced || removed || referencedCheck(referenced, key, t)) {
      if (removed) {
        const branch = tree[key]
        if (branch) {
          let block
          if (referenced) {
            if (t && matchReferenced(t, referenced, branch)) { block = true }
          }
          if (!block) {
            remove(subs, cb, branch)
            changed = true
          }
        }
      } else {
        if (previous) {
          changed = property(
            key,
            get(t, key),
            subs,
            cb,
            tree,
            getPrevious(t, previous, key)
          )
        } else {
          changed = property(
            key,
            get(t, key),
            subs,
            cb,
            tree
          )
        }
      }
    }
  }
  return changed
}

exports.item = item
exports.diff = diff

property = require('./property')
remove = require('./remove').remove
any = require('./any')
