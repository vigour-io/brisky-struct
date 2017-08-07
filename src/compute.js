import { getRefVal } from './references'

const origin = t => {
  const clean = t
  t._rc = t._rc || t._c
  if ((t = getRefVal(t)) && typeof t === 'object' && t.inherits) {
    t._rc = t._rc || clean._rc
    clean._rc = null
    return origin(t)
  } else {
    clean._rc = null
    return clean
  }
}

const transform = t => t.$transform !== void 0
  ? t.$transform
  : t.inherits && transform(t.inherits)

const compute = (t, val, passon, arg) => {
  if (val === void 0) {
    t._rc = t._rc || t._c
    val = getRefVal(t)
  }
  if (val) {
    const type = typeof val
    if (type === 'object') {
      if (val.inherits) {
        const v = val
        val._rc = t._rc
        val = compute(val, void 0, passon, arg)
        if (val === void 0) {
          val = v
        }
      }
    } else if (type === 'function') {
      val = val(val, passon || t)
    }
  }
  if (t._rc) {
    t._rc = null
  }
  const trans = transform(t)
  return trans ? trans(val, passon || t, arg) : val
}

export { origin, compute }
