import struct from './struct'
import { create, set } from './manipulate'
import methods from './methods'

set(struct, { inject: methods })

export default (val, stamp) => create(struct, val, stamp)
