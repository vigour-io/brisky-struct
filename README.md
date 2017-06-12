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
  const master = struct.create({ key: 'value' })
```

### Serialize

```js
  console.log(master.serialize()) // → { "key": "value" }
```

### Set

⚠ Default behaviour is merge.

```js
  master.set({ newKey: { subKey: 'subValue' } })
  console.log(master.serialize()) // → { "key": "value", "newKey": { "subKey": "subValue" } }
```

### Get

```js
  console.log(master.get('newKey').serialize()) // → { subKey: "subValue" }
```

### Compute

```js
  console.log(master.get('key').compute()) // → "value"
  const sub = master.get(['newKey', 'subKey'])
  console.log(sub.compute()) // → "subValue"
```

### Key

```js
  console.log(sub.key) // → "subKey"
```

### Path

```js
  console.log(sub.path()) // → ["newKey", "subKey"]
```
