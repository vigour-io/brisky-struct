if (typeof window === 'undefined') {
  require('source-map-support').install()
}
require('./define')
require('./inject')
require('./serialize')
require('./traversal')
require('./references')
require('./compute')
require('./get')
require('./iterators')
require('./once')
require('./async')
require('./set')
require('./remove')
require('./on')
require('./context')
require('./references')
require('./traversal')
require('./props')
require('./subscribe')
// // -- merge bug -- try tor ecreate -brender play case (wrong context or somethign) -- mostly in props same issue prob
require('./types')
