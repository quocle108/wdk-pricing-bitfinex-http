'use strict'

import { describe, expect, it, jest, beforeAll } from '@jest/globals'
import { BitfinexPricingClient } from '../../index.js'

describe('Integration: BitfinexPricingClient (real API)', () => {
  beforeAll(() => {
    jest.setTimeout(20000)
  })

  it('fetches current price from Bitfinex API without mocks', async () => {
    const client = new BitfinexPricingClient()

    const price = await client.getCurrentPrice('BTC', 'USD')

    expect(typeof price).toBe('number')
    expect(price).toBeGreaterThan(0)
  })

  it('fetches multiple prices from Bitfinex API without mocks', async () => {
    const client = new BitfinexPricingClient()

    const prices = await client.getMultiCurrentPrices([
      { from: 'BTC', to: 'USD' },
      { from: 'ETH', to: 'USD' }
    ])

    expect(prices).toHaveLength(2)
    expect(typeof prices[0]).toBe('number')
    expect(typeof prices[1]).toBe('number')
    expect(prices[0]).toBeGreaterThan(0)
    expect(prices[1]).toBeGreaterThan(0)
  })

  it('converts to a fiat currency Bitfinex does not quote directly via a USD pivot', async () => {
    const client = new BitfinexPricingClient()

    // BRL is not quoted directly by Bitfinex, so this exercises the USD pivot path
    const price = await client.getCurrentPrice('BTC', 'BRL')

    expect(typeof price).toBe('number')
    expect(price).toBeGreaterThan(0)
  })
})



