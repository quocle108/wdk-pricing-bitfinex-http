/**
 * @typedef {import('@tetherto/wdk-pricing-provider').PricePair} PricePair
 * @typedef {import('@tetherto/wdk-pricing-provider').HistoricalPriceOptions} HistoricalPriceOptions
 * @typedef {import('@tetherto/wdk-pricing-provider').HistoricalPriceResult} HistoricalPriceResult
 * @typedef {import('@tetherto/wdk-pricing-provider').PriceData} PriceData
 */
export class BitfinexPricingClient extends PricingClient {
    /** @internal */
    HISTORICAL_DATA_AGE: number;
    /** @internal */
    MAX_HISTORICAL_ENTRIES: number;
    /** @internal */
    client: import("axios").AxiosInstance;
    /**
     * Posts a batch of FX conversion requests to Bitfinex and returns the
     * resulting rates in the same order as the input pairs. Bitfinex returns
     * `null` for any pair it cannot convert directly.
     * @internal
     * @param {Array<{ ccy1: string, ccy2: string, fiat_fx?: number, amount?: number }>} pairs
     * @returns {Promise<Array<number|null>>}
     */
    _fxBatch(pairs: Array<{
        ccy1: string;
        ccy2: string;
        fiat_fx?: number;
        amount?: number;
    }>): Promise<Array<number | null>>;
    /**
     * Builds a Bitfinex ticker symbol for a currency pair.
     * Bitfinex requires a colon separator when either symbol is longer than 3 characters
     * (e.g. tXAUT:USD instead of tXAUTUSD).
     * @internal
     * @param {string} from - Base currency (e.g. 'BTC', 'XAUT')
     * @param {string} to - Quote currency (e.g. 'USD')
     * @returns {string} Bitfinex ticker symbol (e.g. 'tBTCUSD', 'tXAUT:USD')
     */
    _tickerFor(from: string, to: string): string;
    /**
     * @internal
     * @param {HistoricalPriceResult[]} results
     * @returns {HistoricalPriceResult[]}
     */
    _cappedToMaxResults(results: HistoricalPriceResult[]): HistoricalPriceResult[];
}
export type PricePair = import("@tetherto/wdk-pricing-provider").PricePair;
export type HistoricalPriceOptions = import("@tetherto/wdk-pricing-provider").HistoricalPriceOptions;
export type HistoricalPriceResult = import("@tetherto/wdk-pricing-provider").HistoricalPriceResult;
export type PriceData = import("@tetherto/wdk-pricing-provider").PriceData;
import { PricingClient } from '@tetherto/wdk-pricing-provider';
