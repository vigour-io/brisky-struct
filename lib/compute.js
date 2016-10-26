const get = t => t.val !== void 0 ? t.val : t.inherits && get(t.inherits)

const compute = (t, val, passon) => {
  if (val === void 0) {
    val = t.val
    if (val === void 0) { val = get(t.inherits) }
    if (val && typeof val === 'object' && val.inherits) {
      val = compute(val)
    }
  }
  return t.$transform ? t.$transform(val, passon || t) : val
}

const origin = t => t.val && typeof t.val === 'object' && t.val.inherits ? origin(t.val) : t

exports.origin = origin
exports.compute = compute
