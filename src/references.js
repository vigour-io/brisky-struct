import { set } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import getApi from './get/api'

const removeReference = t => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
}

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

export { removeReference, reference }
