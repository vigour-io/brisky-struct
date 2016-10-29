// will combined lookup
const parent = (t) => {

}

const path = (t) => {
  const p = []
  var parent = t
  while (parent && parent.key) {
    if (parent.context) {
      if (typeof parent.contextPath === 'string') {
        p.unshift(parent.contextPath)
      } else {
        let i = parent.contextPath.length
        while (i--) { p.push(parent.contextPath[i]) }
      }
      parent = parent.context
    } else {
      p.unshift(parent.key)
      parent = parent.parent
    }
  }
  return p
}

exports.path = path
exports.parent = parent
