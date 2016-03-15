'use strict'

const assert = require('assert')

describe('Trailpack', () => {
  let packs
  before(() => {
    packs = global.app.packs
    assert(packs)
  })
  it.skip('TODO should be loaded into the app.packs collection', () => {
    // assert that packs contains this trailpack
  })
  describe('#validate', () => {
    it.skip('TODO test')
  })
  describe('#configure', () => {
    it.skip('TODO test')
  })
  describe('#initialize', () => {
    it.skip('TODO test')
  })
})
