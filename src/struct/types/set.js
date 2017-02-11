const createSetObj = (t, top) => {
  const result = {}
  const keys = t._ks
  if (t.type && !top) result.type = t.type.compute()
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let field = t[key]
      if (field) result[key] = createSetObj(field, false)
    }
  }
  if (t.val !== void 0) result.val = t.val
  return result
}

export default createSetObj
