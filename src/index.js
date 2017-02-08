import struct from './struct'
import { create as c, set } from './manipulate'
import methods from './methods'
import { get, getVal } from './get'
import { getProp as getProperty, property } from './property'
import { contextProperty } from './context'
import { subscribe, parse } from './subscribe'
import { getKeys } from './keys'
// // maybe remove cuid
import { cuid, uid, puid } from './uid'
import getType from './struct/types/get'

if (typeof __filename !== 'undefined') console.log('brisky-struct:', __filename)
// const emitterProperty = struct.props.on.struct.props.default

set(struct, { inject: methods })

const create = (val, stamp, t = struct, parent, key) =>
  c(t, val, stamp, parent, key)

export {
  subscribe,
  parse,
  create,
  set,
  struct,
  property,
  contextProperty,
  // emitterProperty,
  get,
  getProperty,
  getKeys,
  getType,
  getVal,
  uid,
  cuid,
  puid
}
