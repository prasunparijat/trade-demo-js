import { AddTradeController } from '../src/trade_module/controller.js';
import { INVALID_TRADE_EXCEPTION } from '../src/trade_module/error_messages.js';
import { ResponseWriter, Side, Symbol } from '../src/utils/common.js';
import { ResetPortfolio } from './utils/common.js';

describe('Test_AddTrade', () => {
  beforeEach(() => {
    ResetPortfolio();
  });

  const testTrades = {
    negativeQuantity: {
      id: 'buy-btc-1',
      symbol: Symbol.BTC,
      price: 40000,
      user: 'Prasun',
      quantity: -1,
      side: Side.BUY,
      timestamp: 1758246516466,
    },
    zeroQuantity: {
      id: 'buy-btc-2',
      symbol: Symbol.BTC,
      price: 40000,
      user: 'Prasun',
      quantity: 0,
      side: Side.BUY,
      timestamp: 1758246516466,
    },
    validBuy: {
      id: 'buy-btc-3',
      symbol: Symbol.BTC,
      price: 40000,
      user: 'Prasun',
      quantity: 1,
      side: Side.BUY,
      timestamp: 1758246516466,
    },
    priceZero: {
      id: 'buy-btc-4',
      symbol: Symbol.BTC,
      price: 0,
      user: 'Prasun',
      quantity: 1,
      side: Side.BUY,
      timestamp: 1758246516466,
    },
    sellTooMuch: {
      id: 'sell-btc-1',
      symbol: Symbol.BTC,
      price: 40000,
      user: 'Prasun',
      quantity: 1,
      side: Side.SELL,
      timestamp: 1758246516466,
    },
    validSell: {
      id: 'sell-btc-2',
      symbol: Symbol.BTC,
      price: 40000,
      user: 'Prasun',
      quantity: 1,
      side: Side.SELL,
      timestamp: 1758246516466,
    },
  };

  const expectedSuccessfulBuyTrade = {
    data: {
      id: 'buy-btc-3',
      price: 40000,
      quantity: 1,
      side: 'BUY',
      symbol: 'BTC',
      timestamp: 1758246516466,
      user: 'Prasun',
    },
    errorMessage: undefined,
    status: 201,
  };
  const expectedSuccessfulSellTrade = {
    data: {
      id: 'sell-btc-2',
      price: 40000,
      quantity: 1,
      side: 'SELL',
      symbol: 'BTC',
      timestamp: 1758246516466,
      user: 'Prasun',
    },
    errorMessage: undefined,
    status: 201,
  };

  test('should fail trade with negative quantity', () => {
    const result = AddTradeController(testTrades.negativeQuantity);
    expect(result).toEqual(
      ResponseWriter(
        400,
        {},
        INVALID_TRADE_EXCEPTION.TRADE_QUANTITY_CANNOT_BE_ZERO_OR_NEGATIVE
      )
    );
  });

  test('should fail trade with zero quantity', () => {
    const result = AddTradeController(testTrades.zeroQuantity);
    expect(result).toEqual(
      ResponseWriter(
        400,
        {},
        INVALID_TRADE_EXCEPTION.TRADE_QUANTITY_CANNOT_BE_ZERO_OR_NEGATIVE
      )
    );
  });

  test('should fail sell trade when quantity is greater than available asset', () => {
    // Portfolio is empty at the start of the test, so any sell should fail.
    const result = AddTradeController(testTrades.priceZero);
    expect(result).toEqual(
      ResponseWriter(
        400,
        {},
        INVALID_TRADE_EXCEPTION.TRADE_PRICE_CANNOT_BE_ZERO_OR_NEGATIVE
      )
    );
  });

  test('should fail price is zero', () => {
    const result = AddTradeController(testTrades.sellTooMuch);
    expect(result).toEqual(
      ResponseWriter(
        400,
        {},
        INVALID_TRADE_EXCEPTION.NOT_ENOUGH_BALANCE_TO_SELL
      )
    );
  });

  test('should successfully execute a valid buy trade', () => {
    const result = AddTradeController(testTrades.validBuy);
    expect(result).toEqual(expectedSuccessfulBuyTrade);
  });

  test('should successfully execute a sell trade when there is enough balance', () => {
    AddTradeController(testTrades.validBuy);
    const result = AddTradeController(testTrades.validSell);
    expect(result).toEqual(expectedSuccessfulSellTrade);
  });
});
