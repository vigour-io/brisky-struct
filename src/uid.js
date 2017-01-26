var cnt = 1e4 // so now a limition becomes 10k fns normal
export const uid = t => { return t._uid || (t._uid = ++cnt) }

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
