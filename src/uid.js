var cnt = 1e4 // so now a limition becomes 10k fns normal
export const uid = t => { return t._uid || (t._uid = ++cnt) }

export const cuid = t => {
  if (t._c) {
    if (t._cLevel === 1) {
      return (uid(t) - 1e4) + '' + cuid(t._c)
    } else {
      return (uid(t) - 1e4) + '' + cuid(t._p)
    }
  } else {
    return uid(t) - 1e4
  }
}
