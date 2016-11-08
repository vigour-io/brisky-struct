const define = (t, val, key) => {
  if (!key) {
    key = val.name || val.displayName
  }
  Object.defineProperty(t, key, { value: val })
  return t
}

module.exports = (struct) => {
  function Constructor () {}
  const proto = Constructor.prototype
  define(proto, Constructor)
  define(struct, Constructor)
}
