import { AddTradeController } from '../../src/trade_module/controller.js';
import { AllTrades, Portfolio, Side, Symbol } from '../../src/utils/common.js';

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

// Populate the market with some trades - modularised and abstracted the code out as it eas being reused
export function PopulateTrades() {
  const trades = [
    {
      id: 'buy-btc-1',
      symbol: Symbol.BTC,
      price: 40000,
      user: 'Prasun',
      quantity: 1,
      side: Side.BUY,
      timestamp: 1758246516466,
    },
    {
      id: 'buy-btc-2',
      symbol: Symbol.BTC,
      price: 42000,
      user: 'Prasun',
      quantity: 1,
      side: Side.BUY,
      timestamp: 1758246516466,
    },
    {
      id: 'sell-btc-1',
      symbol: Symbol.BTC,
      price: 43000,
      user: 'Prasun',

      quantity: 1,
      side: Side.SELL,
      timestamp: 1758246516466,
    },
  ];

  trades.forEach((trade) => {
    const result = AddTradeController(trade);
    expect(result.status).toEqual(201);
  });
}
