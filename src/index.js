import struct from './struct'
import { create as c, set } from './manipulate'
import methods from './methods'
import { generic as emit } from './emit'
import { get, getOrigin, getVal } from './get'
import { getRefVal } from './references'
import { getProp as getProperty, property } from './property'
import { contextProperty } from './context'
import { subscribe, parse } from './subscribe'
import { getKeys, addKey, removeKey, removeContextKey } from './keys'
import { compute } from './compute'
// // maybe remove cuid
import { cuid, uid, puid } from './uid'
import getType from './struct/types/get'
import { switchInheritance } from './inheritance'

const emitterProperty = struct.props.on.struct.props.default
console.log('????B-STRUCT')
set(struct, { inject: methods })

const create = (val, stamp, t = struct, parent, key) =>
  c(t, val, stamp, parent, key)

export {
  subscribe,
  parse,
  create,
  compute,
  emit,
  set,
  struct,
  property,
  contextProperty,
  emitterProperty,
  switchInheritance,
  get,
  getOrigin,
  getRefVal,
  getProperty,
  getKeys,
  removeContextKey,
  addKey,
  removeKey,
  getType,
  getVal,
  uid,
  cuid,
  puid
}
