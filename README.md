# brisky-struct
An observable data structure

[![Build Status](https://travis-ci.org/vigour-io/brisky-struct.svg?branch=master)](https://travis-ci.org/vigour-io/brisky-struct)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/brisky-struct.svg)](https://badge.fury.io/js/brisky-struct)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/brisky-struct/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/brisky-struct?branch=master)

- Deep memory efficient prototypes
- Every value is observable
- Serializable references
- Fast reactive state management. Inspired by virtual-dom tree-diffing algorithms and merkle-trees
- Powerful query syntax
- Fast emitters
- Async helpers, work with generators, promises and iterators
- Low footprint (6kb gzipped)

## CRUD

### Create

```js
  const struct = require('brisky-struct')
  const master = struct.create({ firstKey: 'value' })
```

### Serialize

```js
  master.serialize() // → { "firstKey": "value" }
```

### Set

⚠ Default behaviour is merge.

```js
  master.set({ newKey: { subKey: 'subValue' } })
  master.serialize() // → { "firstKey": "value", "newKey": { "subKey": "subValue" } }
```

### Get

```js
  master.get('newKey').serialize() // → { "subKey": "subValue" }
```

### Keys

```js
  master.keys() // → ["firstKey", "newKey"]
```

### Compute

```js
  master.get('firstKey').compute() // → "value"
  const sub = master.get(['newKey', 'subKey'])
  sub.compute() // → "subValue"
```

## Navigate

### Key

```js
  sub.key // → "subKey"
```

### Path

```js
  sub.path() // → ["newKey", "subKey"]
```

### Parent

```js
  sub.parent().key // → "newKey"
  sub.parent().serialize() // → { "subKey": "subValue" }
```

### Root

```js
  sub.root().serialize() // → { "firstKey": "value", "newKey": { "subKey": "subValue" } }
  sub.root() === master //  → true
```

## Listen

### Data Changes

#### On

⚠ Only named listeners won't override previous.

```js
  var results = []
  master.set({ on: val => results.push(val) })
  master.set({ third: 3 })
  results // → [ { "third": 3 } ]
  master.set({ on: { data: val => results.push(val) } })
  master.set({ fourth: 4 })
  results // → [ { "third": 3 }, { "fourth": 4 } ]
  master.set({ on: { data: { namedListener: val => results.push(val) } } })
  master.set({ fifth: 5 })
  results // → [ { "third": 3 }, { "fourth": 4 }, { "fifth": 5 }, { "fifth": 5 } ]
```

#### On as a method

```js
  results = []
  const first = master.get('firstKey')
  first.on(val => results.push(val))
  first.set('changed')
  results // → [ "changed" ]
  master.set({ firstKey: 'again' })
  results // → [ "changed", "again" ]
```

#### Once

```js
  results = []
  const third = master.get('third')
  third.once().then(val => results.push(val))
  third.set('three')
  results // → [ "three" ]
  third.set('will be ignored')
  results // → [ "three" ]
```

### Events

#### Emit

⚠ Events fired on a path can be listened only at that exact path.
```js
  const errors = []
  master.on('error', err => errors.push(err))
  master.emit('error', 'satellites are not aligned')
  errors // → [ "satellites are not aligned" ]
  sub.on('error', err => errors.push(err))
  sub.emit('error', 'splines are not reticulated')
  errors // → [ "satellites are not aligned", "splines are not reticulated" ]
```
