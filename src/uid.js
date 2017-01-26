import hash from 'string-hash'
var cnt = 1e4 // so now a limition becomes 10k fns normal
export const uid = t => { return t._uid || (t._uid = ++cnt) }

// context Uid
export const cuid = t => {
  if (t._c) {
    var id = 5381
    while (t) {
      id = id * 33 ^ uid(t)
      t = t._cLevel === 1 ? t._c : t._p
    }
    return id >>> 0
  } else {
    return uid(t) - 1e4
  }
}

// can be opt a bit more

// path Uid
export const puid = t => {
  var id = 5381
  var p = t
  if (t._c) {
    while (p) {
      let key = p.key
      if (key !== void 0) {
        id = id * 33 ^ (hash(key))
        p = p._cLevel === 1 ? p._c : p._p
      } else {
        return id >>> 0
      }
    }
    return id >>> 0
  } else if (t._puid) {
    return t._puid
  } else {
    while (p) {
      let key = p.key
      if (key !== void 0) {
        id = id * 33 ^ (hash(key))
        p = p._p
      } else {
        return (t._puid = id >>> 0)
      }
    }
    return (t._puid = id >>> 0)
  }
}
