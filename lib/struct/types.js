import { create, set } from '../manipulate'
import { getDefault, get } from '../get'
import { removeKey } from '../keys'

const types = (t, val, pkey, stamp) => {
  if (!t.types) { t.types = {} }
  for (let key in val) {
    let prop = val[key]
    if (t.types[key]) {
      t.types[key].set(prop, stamp)
    } else {
      if (typeof prop !== 'object' || !prop.inherits) {
        if (prop === 'self') {
          prop = t
        } else {
          // same here all needs to be done with special merging
          // same here
          prop = create(getDefault(t), prop, void 0, t)
        }
      }
      t.types[key] = prop
    }
  }
}

const inheritType = t => t.type || t.inherits && inheritType(t.inherits)

// type will be special to sub subvscribe on :/
const type = (t, val, key, stamp) => {
  // here we can do type switching behaviour
  // need to know if we are resetting! -- how to do that? passon total set?
  if (typeof val === 'object') {
    console.log('setting type with another struct is not supported yet')
  } else {
    const type = t.type || inheritType(t)
    if (type) {
      console.log('got type || find in inheritance', type.compute(), 'replace with', val)
      if (type.compute() === val) {
        console.log('same --- ignore', val)
        return
      } else {
        t = merge(t, val, stamp)
      }
    }
    const struct = getType(t, 'struct')
    t.type = create(struct, val, stamp)
    console.log('wtf???', t.keys())
    // need to ignore this key in instances need a way for this
    // return true // to indicate change
  }
}

const mergeit = (t, result) => {
  if (!result) result = {}
  const keys = t._ks
  const instances = t.instances
  if (instances) {
    console.log('o o instances')
  }

  if (t.type) {
    console.log('setting type but need to take care of inheritance as well...')
    result.type = t.type.compute()
  }

  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      if (t[key]) result[key] = mergeit(t[key])
    }
  }
  if (t.val !== void 0) result.val = t.val
  return result
}

const handleInstances = (t, a) => {
  const instances = t.instances
  if (instances) {
    console.log('\n\nINSTANCES 🤹')
    a.instances = instances
    for (let i = 0, len = instances.length; i < len; i++) {
      console.log('  --> change inherits! 🤹 \n')
      instances[i].inherits = a
      if ('_ks' in instances[i]) {
        let newKeys = a.keys().concat()
        let keys = instances[i]._ks || []
        instances[i]._ks = newKeys // now update your own instances as well!
        // take longest one of course -- this is not enought....
        for (let j = 0, len = newKeys.length; j < len; j++) {
          if (instances[i][newKeys[j]] === null) {
            console.log('????', newKeys[j])
            if (get(a, newKeys[j])) {
              console.log('REMOVE KEY!', newKeys[j])
              removeKey(instances[i], newKeys[i])
            }
            // remove!
          }
        }

        for (let j = 0, len = keys.length; j < len; j++) {
          if (instances[i][keys[j]]) {
            newKeys.push(keys[j])
            // own keys!
          }
        }


        /*
          else if (instances[i][keys[j]] === null) {
            console.oog('????', keys[j])
            if (get(a, keys[j])) {
              console.log('REMOVE KEY!', keys[j])
            }
            // remove!
          }
        */

        handleInstances(instances[i], instances[i])
      }
      // now need to update the keys array on the instance

      // maybe more like updates etc
      // needs the same treatment
    }
  }
}

const merge = (t, type, stamp) => {
  // need to find in real i geuss....
  const result = getType(t._p, type, t)
  if (result) {
    // keys
    if (t._ks || t.val !== void 0) {
      t.inherits = result // does this need to be a mix between previous inhertance?
      // the slow way
      console.log('\n🌊 🤹  have my own MERGE on create 🌊 🌊 ', type, inheritType(t).compute())
      // not enough
      console.log(t._ks, t.val)
      // now fire and fix EVERYTHING
      const raw = mergeit(t)
      delete raw.type
      const a = create(result, raw, void 0, t._p, t.key)
      // a.poep = true
      handleInstances(t, a)
      // now how to know what to update? make some real usecases
      // at least nothing in raw has to be updates but probablt everything else...
      // over instances etc
      // maybe even some of the raw need updates since types are switched
      // else just clear everything -- subs will not fire for sure
      // but need to emit change

      console.log(JSON.stringify(raw, false, 2))
      return a
    } else {
      // may need to fire for context
      console.log('\n🤡 found a type 🤡  - ', type)
    }
  }
  return t
}

const createType = (parent, val, t, stamp) => {
  const type = val.type
  var instance
  if (val.reset) {
    instance = new t.Constructor()
    instance.inherits = t
  } else {
    console.log('TODO: need to merge types on create figure out later')
    t = getType(parent, type, t) || t
    instance = new t.Constructor()
    instance.inherits = t
  }
  return instance
}

const getType = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent._p && getType(parent._p, type)
  )

export { types, type, createType }
