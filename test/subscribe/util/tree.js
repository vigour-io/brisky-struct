const copy = tree => {
  const result = {}
  if (tree instanceof Array) {
    return tree.concat()
  } else {
    for (let i in tree) {
      if (i !== '$t' && i !== '$' && i !== '_p' && i !== '_key') {
        if (tree[i] && typeof tree[i] === 'object' && !tree[i].inherits) {
          result[i] = copy(tree[i])
        } else {
          result[i] = tree[i]
        }
      }
    }
    return result
  }
}

module.exports = copy
