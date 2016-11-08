const CONSTRUCTOR = 'Constructor'
const define = (t, val, key) => {
  Object.defineProperty(t, key, {
    value: val,
    configurable: true
  })
  return t
}

const createConstructor = (t, Inherit) => {
  function Struct () {} // named perhaps?
  if (Inherit) {
    Struct.prototype = new Inherit() // opt this for speed later
  }
  define(Struct.prototype, Struct, CONSTRUCTOR)
  define(t, Struct, CONSTRUCTOR)
  return Struct
}

module.exports = (struct) => {
  createConstructor(struct)
  struct.props.define = (t, val) => {
    var proto
    if (!t.hasOwnProperty(CONSTRUCTOR)) {
      createConstructor(t, t.Constructor)
    }
    proto = t.Constructor.prototype
    for (let key in val) { define(proto, val[key], key) }
  }
}
