module.exports = function logTree (tree, level, key, str) {
  if (str === void 0) {
    str = ''
  }
  str += (indent(level) + (key ? key + ':' : '') + ' {') + '\n'
  if (!level) {
    level = 0
  }
  for (let i in tree) {
    if (i !== '_p' && i !== '_key' && i !== '$t') {
      if (typeof tree[i] === 'object') {
        str += logTree(tree[i], level + 1, i) + '\n'
      } else {
        str += (
          indent(level + 1) + (i + ':' || '') + ' ' +
          (tree[i] && tree[i].isBase
            ? 'STATE: ' + tree[i].path().join('/')
            : tree[i]
          )
        ) + '\n'
      }
    }
  }
  str += (indent(level) + '}')
  return str
}

function indent (i) {
  var str = ''
  while (i) {
    i--
    str += '- '
  }
  return str
}
