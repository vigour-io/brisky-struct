const compute = (target, val, passon) => {
  if (!val) {
    val = target.val
    if (typeof val === 'object' && !val.inherits) {
      console.log('!!!@@#@!#!!!!')
    }
    if (typeof val === 'object' && val.inherits) {
      val = compute(val)
    }
  }
  if (target.$transform) {
    return target.$transform(val, passon || target)
  } else {
    return val
  }
}

module.exports = compute
