// will combined lookup
const parent = (t) => {

}

const path = (t) => {
  const result = []
  var parent = t
  while (parent) {
    if (parent.context) {
      console.log('--->', parent.key, parent.context.key, parent.contextPath)
      let i = parent.contextLevel
      let p = parent
      while (i--) {
        result.unshift(p.key)
        p = p.parent
      }
      parent = parent.context
    } else if (parent.key) {
      result.unshift(parent.key)
      parent = parent.parent
    } else {
      break
    }
  }
  return result
}

exports.path = path
exports.parent = parent
