var cnt = 1e4 // so now a limition becomes 10k fns normal
export default t => { return t._uid || (t._uid = ++cnt) }
