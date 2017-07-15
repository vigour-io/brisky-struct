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
const root = struct.create({ firstKey: 'value' })
```

### Serialize

```js
root.serialize() // → { "firstKey": "value" }
```

### Set

⚠ Default behaviour is merge.

```js
root.set({ second: { subKey: 'subValue' } })
root.serialize() // → { "firstKey": "value", "second": { "subKey": "subValue" } }
```

### Get

```js
root.get('second').serialize() // → { "subKey": "subValue" }
```

### Keys

```js
root.keys() // → [ "firstKey", "second" ]
```

### Remove

```js
root.set({ firstKey: null })
root.get('firstKey') // → undefined
root.keys() // → [ "second" ]
```

### Compute

```js
const sub = root.get(['second', 'subKey'])
sub.compute() // → "subValue"
```

## Navigate

### Key

```js
sub.key // → "subKey"
```

### Path

```js
sub.path() // → ["second", "subKey"]
```

### Parent

```js
sub.parent().key // → "second"
sub.parent().serialize() // → { "subKey": "subValue" }
```

### Root

```js
sub.root().serialize() // → { "second": { "subKey": "subValue" } }
sub.root() === root // → true
```

## Listen

### On

#### Default listener

```js
var results = []
root.set({ on: val => results.push(val) })
root.set({ third: 3 })
results // → [ { "third": 3 } ]
```

#### Data listener

```js
root.set({ on: { data: val => results.push(val) } })
root.set({ fourth: 4 })
results // → [ { "third": 3 }, { "fourth": 4 } ]
```

#### Named data listener

⚠ Only named listeners won't override existing listeners. Notice that `fifth` appears twice in the results array.

```js
root.set({ on: { data: { namedListener: val => results.push(val) } } })
root.set({ fifth: 5 })
results // → [ { "third": 3 }, { "fourth": 4 }, { "fifth": 5 }, { "fifth": 5 } ]
```

#### On as a method

```js
results = []
const third = root.get('third')
third.on(val => results.push(val))
third.set('changed')
results // → [ "changed" ]
root.set({ third: 'again' })
results // → [ "changed", "again" ]
```

### Once

#### Once as a method

```js
results = []
const fourth = root.get('fourth')
fourth.once('four', val => results.push(val))
fourth.set('will be ignored')
results // → [ ]
fourth.set('four')
results // → [ "four" ]
```

#### Once as a promise

```js
results = []
fourth.once().then(val => results.push(val))
fourth.set('changed')
results // → [ "changed" ]
fourth.set('will be ignored')
results // → [ "changed" ]
```

### Emit

⚠ Events fired on a path can be listened only at exact same path.

```js
const errors = []
root.on('error', err => errors.push(err))
root.emit('error', 'satellites are not aligned')
errors // → [ "satellites are not aligned" ]
sub.once('error', err => errors.push(err))
sub.emit('error', 'splines are not reticulated')
errors // → [ "satellites are not aligned", "splines are not reticulated" ]
```

# More about get and set

## Get with set

Second parameter of get is a default value for the path.

⚠ It'll be `set` and returned in absence of given path otherwise it'll be ignored.

```js
root.get('firstKey', 'newValue').compute() // → "newValue"
root.get('firstKey').compute() // → "newValue"
root.get('fifth', 'newValue').compute() // → 5
```

## Get a path with methods

⚠ Available methods are `root`, `parent` and `compute`.

```js
root.get(['firstKey', 'compute']) // → "newValue"
root.get(['second', 'subKey', 'parent']).serialize() // → { "subKey": "subValue" }
sub.get(['root', 'fifth', 'compute']) // → 5
```

## Set without merge (reset)

Third parameter of set is a reset flag.

⚠ Second parameter is a stamp, will come to our plate on further chapters.

```js
const second = root.get('second')
second.set({ newSubKey: 'newSubValue' })
second.serialize() // → { "subKey": "subValue", "newSubKey": "newSubValue" }
second.set({ onlySubKey: 'onlySubValue' }, void 0, true)
second.serialize() // → { "onlySubKey": "onlySubValue" }
```

# Master and branches

```js
const master = struct.create({
  movies: {
    tt0130827: {
     year: 1998,
     imdb: 7.7,
     title: 'Run Lola Run'
    },
    tt0301357: {
      year: 2003,
      imdb: 7.7,
      title: 'Good Bye Lenin'
    },
    tt0408777: {
      year: 2004,
      imdb: 7.5,
      title: 'The Edukators'
    }
  }
})

const branchM = master.create({
  userName:'Mustafa',
  movies: {
    tt0130827: { favourite: true },
    tt0408777: { favourite: true }
  }
})

const branchJ = master.create({
  userName:'Jim',
  movies: {
    tt0301357: { favourite: true }
  }
})

master.get('userName') // → undefined

branchM.get(['movies', 'tt0408777']).serialize()
// → { "year": 2004, "imdb": 7.5, "title": "The Edukators", "favourite": true }
branchJ.get(['movies', 'tt0408777']).serialize()
// → { "year": 2004, "imdb": 7.5, "title": "The Edukators" }
master.get(['movies', 'tt0408777']).serialize()
// → { "year": 2004, "imdb": 7.5, "title": "The Edukators" }

master.get(['movies', 'tt0130827', 'rating'], 'R')
branchJ.get(['movies', 'tt0130827', 'rating', 'compute']) // → "R"
branchM.get(['movies', 'tt0130827', 'rating', 'compute']) // → "R"

branchJ.get(['movies', 'tt0130827', 'rating']).set('G')
branchM.get(['movies', 'tt0130827', 'rating', 'compute']) // → "R"

master.get(['movies', 'tt0130827', 'rating']).set('PG')
branchM.get(['movies', 'tt0130827', 'rating', 'compute']) // → "PG"
branchJ.get(['movies', 'tt0130827', 'rating', 'compute']) // → "G"
```
