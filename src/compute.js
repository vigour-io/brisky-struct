import { getRefVal } from './references'

const origin = t => t.val && typeof t.val === 'object' && t.val.inherits
  ? origin(t.val) : t

const transform = t => t.$transform !== void 0
  ? t.$transform
  : t.inherits && transform(t.inherits)

const compute = (t, val, passon, arg, context) => {
  if (val === void 0) {
    if (!context) {
      context = { c: t._c }
    }
    val = getRefVal(t, context)
  }
  if (val) {
    const type = typeof val
    if (type === 'object') {
      if (val.inherits) {
        const v = val
        val = compute(val, void 0, passon, arg, context)
        if (val === void 0) {
          val = v
        }
      }
    } else if (type === 'function') {
      val = val(val, passon || t)
    }
  }
  const trans = transform(t)
  return trans ? trans(val, passon || t, arg) : val
}

export { origin, compute }
