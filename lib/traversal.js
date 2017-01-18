const parent = t => {
  if (t._c) {
    if (t._cLevel === 1) {
      return t._c
    } else {
      t._p._cLevel = t._cLevel - 1
      t._p._c = t._c
      return t._p
    }
  } else {
    return t._p
  }
}

const root = (t, real) => {
  var p = t
  if (real) {
    while (p) {
      t = p
      p = p._p
    }
  } else {
    while (p) {
      t = p
      p = parent(p)
    }
  }
  return t
}

// add option for resolve
const path = (t, real) => {
  const result = []
  var parent = t
  while (parent) {
    if (parent._c && !real) {
      let i = parent._cLevel
      let p = parent
      while (i--) {
        result.unshift(p.key)
        p = p._p
      }
      parent = parent._c
    } else if (parent.key) {
      result.unshift(parent.key)
      parent = parent._p
    } else {
      break
    }
  }
  return result
}

export { path, parent, root }
