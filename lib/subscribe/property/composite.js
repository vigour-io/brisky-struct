var property
const { parse } = require('../diff')

const composite = (t, subs, cb, branch, tree) => {
  var changed
  const c = branch.$c
  if (tree._key === '$any') {
    for (let key in c) {
      if (key in branch && property(key, t, subs[key], cb, branch)) {
        changed = true
      }
    }
  } else {
    for (let key in c) {
      if (key in branch && key in subs && parse(key, t, subs, cb, branch)) {
        changed = true
      }
    }
  }
  return changed
}

module.exports = composite
property = require('./')
