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
