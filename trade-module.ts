// Assume a single user + in memory + no auth + FIFO
// User is Prasun

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
interface Asset {
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

function isValidTrade(trade: Trade): boolean {
  if (trade.quantity <= 0) return false;

  switch (trade.side) {
    case Side.BUY:
      return true; // Assuming user can always buy (has enough USDT)
    case Side.SELL:
      return Portfolio.get(trade.symbol)!.quantity >= trade.quantity;
  }
}

function ExecuteTrade(trade: Trade) {
  // Just a ledger
  AllTrades[trade.symbol][trade.side].push(trade);

  // Main logic to update portfolio
  let {
    quantity: currentQuantity,
    averagePurchasePriceUSDT: currentAveragePurchasePriceUSDT,
    realizedReturnUSDT: currentRealisedReturnUSDT,
  } = Portfolio.get(trade.symbol)!;
  let investedValue = currentQuantity * currentAveragePurchasePriceUSDT;
  let currentValue = trade.quantity * trade.price;

  switch (trade.side) {
    case Side.BUY:
      investedValue += currentValue;
      currentQuantity += trade.quantity;
      Portfolio.set(trade.symbol, {
        quantity: currentQuantity,
        averagePurchasePriceUSDT: investedValue / currentQuantity,
        realizedReturnUSDT: currentRealisedReturnUSDT,
      });
      break;
    case Side.SELL:
      currentQuantity -= trade.quantity;
      Portfolio.set(trade.symbol, {
        quantity: currentQuantity,
        averagePurchasePriceUSDT: currentAveragePurchasePriceUSDT,
        realizedReturnUSDT:
          currentRealisedReturnUSDT +
          (trade.price - currentAveragePurchasePriceUSDT) * trade.quantity,
      });
      break;
  }
}

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

export function AddTrade(trade: Trade) {
  // Here assuming that the trade is valid from the structural aspect / would have used validate Trade (Even better in nestjs we use class-validator at the DTO level itself for various sanity checks and request sanitisations)

  // validate the trade from the business logic aspect
  if (!isValidTrade(trade)) return 'Trade is invalid';

  ExecuteTrade(trade);
  return 'Trade executed successfully';
}

export function GetPortFolio() {
  return Object.fromEntries(Portfolio);
}

export function GetProfitAndLossReport() {
  let Report: ProfitAndLossReport = {
    totalReturns: {
      unrealized: 0,
      realized: 0,
    },
    individualAssetReturns: [],
  };

  for (const [
    symbol,
    { quantity, averagePurchasePriceUSDT, realizedReturnUSDT },
  ] of Portfolio.entries()) {
    const unrealized =
      (CurrentMarketPrices[symbol] - averagePurchasePriceUSDT) * quantity;
    Report.totalReturns.unrealized += unrealized;
    Report.totalReturns.realized += realizedReturnUSDT;
    Report.individualAssetReturns.push({
      symbol,
      unrealized,
      realized: realizedReturnUSDT,
    });
  }
  return Report;
}

export function ResetPortfolio() {
  Portfolio.set(Symbol.BTC, {
    quantity: 0,
    averagePurchasePriceUSDT: 0,
    realizedReturnUSDT: 0,
  });
  Portfolio.set(Symbol.ETH, {
    quantity: 0,
    averagePurchasePriceUSDT: 0,
    realizedReturnUSDT: 0,
  });
  AllTrades[Symbol.BTC][Side.BUY] = [];
  AllTrades[Symbol.BTC][Side.SELL] = [];
  AllTrades[Symbol.ETH][Side.BUY] = [];
  AllTrades[Symbol.ETH][Side.SELL] = [];
}
