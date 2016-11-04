'use strict'

const test = require('tape')
const { create, set, get, struct, compute, parent } = require('../../')

test('props - default', t => {
  const s = create(struct, {
    props: {
      falan: true
    },
    falan: 'filan'
  })

  t.equal(get(s, 'falan'), 'filan', 'falan is filan')
  t.end()
})
