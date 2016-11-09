// will combined lookup
const parent = t => {
  if (t.context) {
    if (t.contextLevel === 1) {
      return t.context
    } else {
      t._p.contextLevel = t.contextLevel - 1
      t._p.context = t.context
      return t._p
    }
  } else {
    return t._p
  }
}

const root = t => {
  var p = t
  while (p) {
    t = p
    p = parent(p)
  }
  return t
}

const path = t => {
  const result = []
  var parent = t
  while (parent) {
    if (parent.context) {
      let i = parent.contextLevel
      let p = parent
      while (i--) {
        result.unshift(p._k)
        p = p._p
      }
      parent = parent.context
    } else if (parent._k) {
      result.unshift(parent._k)
      parent = parent._p
    } else {
      break
    }
  }
  return result
}

exports.path = path
exports.parent = parent
exports.root = root
