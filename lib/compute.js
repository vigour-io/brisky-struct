const compute = (t, val, passon) => {
  if (!val) {
    val = t.val
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
