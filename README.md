# @tetherto/wdk-pricing-bitfinex-http

Note: This package is in beta. Please test in a dev setup first.

HTTP client for prices from Bitfinex, it uses [Bitfinex Public HTTP API](https://docs.bitfinex.com/docs/rest-public) to obtain the current price & historical data for given ticker.

It works as a `PricingClient` for [`@tetherto/wdk-pricing-provider`](https://github.com/tetherto/wdk-pricing-provider).

## 🔍 About WDK

This module is part of the WDK (Wallet Development Kit) project. Learn more at https://docs.wallet.tether.io.

## ✨ Features

- Compatible with [@tetherto/wdk-pricing-provider](https://github.com/tetherto/wdk-pricing-provider)
- Fetch current price for given ticker (single or batch) via the Bitfinex FX endpoint
- Converts to fiat currencies Bitfinex does not quote directly (e.g. BRL, ARS, MXN) by pivoting through USD using its fiat FX rates
- Fetch historical prices given ticker
- Downscales long history to max 100 points

## ⬇️ Installation

```bash
npm install @tetherto/wdk-pricing-bitfinex-http
```

## 🚀 Quick Start

```javascript
import { BitfinexPricingClient } from "@tetherto/wdk-pricing-bitfinex-http";

// Create the client
const client = new BitfinexPricingClient();

// Get latest price
const current = await client.getCurrentPrice("BTC", "USD");

// Get historical prices
const history = await client.getHistoricalPrice("BTC", "USD", {
  start: 1709906400000, // optional
  end: 1709913600000, // optional
});
```

## 📚 API Reference

### BitfinexPricingClient

Simple HTTP pricing client for Bitfinex.

#### Constructor

```javascript
new BitfinexPricingClient(options?)
```

Parameters:

- `options` (optional): future use

### Methods

| Method                               | Description                       | Returns                                  |
| ------------------------------------ | --------------------------------- | ---------------------------------------- |
| `getCurrentPrice(base, quote)`       | Get latest price                  | `Promise<number \| null>`                |
| `getMultiCurrentPrices(pairs)`       | Get latest prices in a batch      | `Promise<Array<number \| undefined>>`    |
| `getMultiPriceData(pairs)`           | Get last price + 24h change batch | `Promise<Array<PriceData \| undefined>>` |
| `getHistoricalPrice(from, to, opts?)`| Get price history                 | `Promise<Array<any>>`                    |

#### `getCurrentPrice(base, quote)`

Uses the Bitfinex `/calc/fx/batch` endpoint. If Bitfinex cannot quote the pair
directly (typically a fiat currency it does not list), it falls back to a
two-leg conversion through USD: `base → USD → quote`. Returns `null` if the
pair cannot be resolved even through the pivot.

```javascript
const price = await client.getCurrentPrice("BTC", "USD");
const brl = await client.getCurrentPrice("BTC", "BRL"); // resolved via USD pivot
```

#### `getMultiCurrentPrices(pairs)`

Resolves many pairs in a single batch request, applying the same USD-pivot
fallback per pair. Results are returned in the same order as the input; a pair
that cannot be resolved even through the pivot is `undefined`.

```javascript
const prices = await client.getMultiCurrentPrices([
  { from: "BTC", to: "USD" },
  { from: "ETH", to: "BRL" },
]);
```

#### `getMultiPriceData(pairs)`

Returns the last price plus 24h absolute and relative change for each pair, from
the Bitfinex `/tickers` endpoint. Unlike the methods above, it does **not** use
the USD pivot, so a currency Bitfinex does not quote directly resolves to
`undefined`. Results are returned in the same order as the input.

```javascript
const data = await client.getMultiPriceData([{ from: "BTC", to: "USD" }]);
// [{ lastPrice, dailyChange, dailyChangeRelative }]
```

#### `getHistoricalPrice(from, to, opts?)`

If the list is longer than 100 points, it is downscaled by 2x steps until <= 100.

```javascript
const series = await client.getHistoricalPrice("BTC", "USD");
```

## ⚠️ Limitations

- **Currency codes are Bitfinex-specific.** You must pass the codes Bitfinex
  uses, not the common ISO/ticker symbol. For example, Tether is `UST` (not
  `USDT`), and some fiats are only available as tokenized assets such as `CNHT`
  or `MXNT`. Unknown codes resolve to `null` / `undefined`. The full list is at
  `https://api-pub.bitfinex.com/v2/conf/pub:list:currency`.
- **The USD pivot only applies to current prices.** `getCurrentPrice` and
  `getMultiCurrentPrices` fall back to a `from → USD → to` conversion for fiat
  Bitfinex does not quote directly. `getHistoricalPrice` does **not** — it
  returns an empty array for such pairs (Bitfinex has no historical FX series
  for them).
- **`getMultiPriceData` does not support pivot currencies.** It sources last
  price and daily change from `/tickers`, which only exists for natively quoted
  pairs. For a currency that requires the USD pivot (e.g. BRL, ARS) it returns
  `undefined` for that entry.

## 🛠️ Development

```bash
npm install
npm run lint
npm test
```

## 📜 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

For support, please open an issue on the GitHub repository.
