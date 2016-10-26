const get = t => t.val !== void 0 ? t.val : t.inherits && get(t.inherits)
// perf the shit out of this

const compute = (t, val, passon) => {
  if (val === void 0) {
    val = t.val
    if (val === void 0) { val = get(t.inherits) }
    if (typeof val === 'object' && val.inherits) {
      val = compute(val)
    }
  }
  if (t.$transform) {
    return t.$transform(val, passon || t)
  } else {
    return val
  }
}

const origin = t => t.val && typeof t.val === 'object' && t.val.inherits ? origin(t.val) : t

exports.origin = origin
exports.compute = compute
