var cnt = 1e4 // so now a limition becomes 10k fns normal
const uid = t => { return t._uid || (t._uid = ++cnt) }
module.exports = uid
