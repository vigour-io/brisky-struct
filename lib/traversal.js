// will combined lookup
const parent = (t) => {

}

const path = (t) => {
  const p = []
  var parent = t
  while (parent) {
    if (parent.context) {
      console.log('--->', parent.key, parent.context.key, parent.contextPath)
      if (typeof parent.contextPath === 'string') {
        p.unshift(parent.contextPath)
      } else {
        let i = parent.contextPath.length
        while (i--) { p.unshift(parent.contextPath[i]) }
      }
      parent = parent.context
    } else if (parent.key) {
      p.unshift(parent.key)
      parent = parent.parent
    } else {
      break
    }
  }
  return p
}

exports.path = path
exports.parent = parent
