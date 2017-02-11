import { get, getVal } from './get'
import { getKeys } from './keys'
import { path } from './traversal'

const compute = (t, result) => {
  const computed = t.compute()
  return computed !== void 0 && typeof computed !== 'object' ? computed : result
}

const serialize = (t, fn) => {
  var result = {}
  var val = getVal(t)
  const keys = getKeys(t)
  if (val && typeof val === 'object' && val.inherits) {
    const p = path(val) // memoized paths later
    val = [ '@', 'root' ]
    let i = p.length
    while (i--) { val[i + 2] = p[i] }
  }
  if (keys) {
    let onlyNumbers = true
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let keyResult = serialize(get(t, key), fn)
      if (isNaN(key)) onlyNumbers = false
      if (keyResult !== void 0) { result[key] = keyResult }
    }
    if (val !== void 0) {
      result.val = val
    } else if (onlyNumbers) {
      const arr = []
      for (let i in result) arr[i] = result[i]
      result = arr
    }
  } else if (val !== void 0) {
    result = val
  }
  return fn ? fn === true ? compute(t, result) : fn(t, result) : result
}

export default serialize
