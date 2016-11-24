const get = t => t.val !== void 0 ? t.val : t.inherits && get(t.inherits)

const origin = t => t.val && typeof t.val === 'object' && t.val.inherits
  ? origin(t.val) : t

const transform = t => t.$transform !== void 0
  ? t.$transform
  : t.inherits && transform(t.inherits)

const compute = (t, val, passon) => {
  if (val === void 0) {
    val = t.val
    if (val === void 0) { val = get(t.inherits) }
  }
  if (val) {
    const type = typeof val
    if (type === 'object') {
      if (val.inherits) {
        const v = val
        val = compute(val)
        if (val === void 0) {
          val = v
        }
      }
    } else if (type === 'function') {
      val = val(val, passon || t)
    }
  }
  const trans = transform(t)
  return trans ? trans(val, passon || t) : val
}

exports.origin = origin
exports.compute = compute
