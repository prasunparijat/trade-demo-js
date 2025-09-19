export const USER = 'Prasun';

// Supported symbols
export enum Symbol {
  BTC = 'BTC',
  ETH = 'ETH',
}

// Supported Sides
export enum Side {
  BUY = 'BUY',
  SELL = 'SELL',
}

// A trade contains all the details of a trade
export interface Trade {
  id: string;
  symbol: Symbol;
  side: Side;
  price: number;
  quantity: number;
  timestamp: number;
}

// Trades contain BUY and SELL Trades grouped together
export interface AssetTrades {
  [Side.BUY]: Trade[];
  [Side.SELL]: Trade[];
}

// A tradebook contains all the trades placed per asset
export interface Tradebook {
  [Symbol.BTC]: AssetTrades;
  [Symbol.ETH]: AssetTrades;
}

// In-memory instance for all trades for the user
export const AllTrades: Tradebook = {
  [Symbol.BTC]: {
    [Side.BUY]: [],
    [Side.SELL]: [],
  },
  [Symbol.ETH]: {
    [Side.BUY]: [],
    [Side.SELL]: [],
  },
};

// An Asset contains details of quantity held, average purchase price and realised returns - helps to build portfolio
export interface Asset {
  quantity: number;
  averagePurchasePriceUSDT: number;
  realizedReturnUSDT: number;
}
// Initialise portfolio with default of 0 BTC and ETH
export const Portfolio: Map<Symbol, Asset> = new Map([
  [
    Symbol.BTC,
    { quantity: 0, averagePurchasePriceUSDT: 0, realizedReturnUSDT: 0 },
  ],
  [
    Symbol.ETH,
    { quantity: 0, averagePurchasePriceUSDT: 0, realizedReturnUSDT: 0 },
  ],
]);

export const CurrentMarketPrices = {
  [Symbol.BTC]: 44000,
  [Symbol.ETH]: 2000,
};

export interface ProfitAndLossReport {
  totalReturns: {
    unrealized: number;
    realized: number;
  };
  individualAssetReturns: {
    symbol: Symbol;
    unrealized: number;
    realized: number;
  }[];
}

export interface ReturnObject {
  status: number;
  data: object;
  errorMessage: string | undefined;
}

export function ResponseWriter(
  status: number,
  data = {},
  errorMessage?: string | undefined
): ReturnObject {
  return { status, data, errorMessage };
}
