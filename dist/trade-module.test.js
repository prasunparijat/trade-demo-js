import { Side, Symbol, ResetPortfolio, AddTrade, GetPortFolio, GetProfitAndLossReport, } from './trade-module.js';
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
            timestamp: Date.now(),
        },
        zeroQuantity: {
            id: 'buy-btc-2',
            symbol: Symbol.BTC,
            price: 40000,
            user: 'Prasun',
            quantity: 0,
            side: Side.BUY,
            timestamp: Date.now(),
        },
        validBuy: {
            id: 'buy-btc-3',
            symbol: Symbol.BTC,
            price: 40000,
            user: 'Prasun',
            quantity: 1,
            side: Side.BUY,
            timestamp: Date.now(),
        },
        sellTooMuch: {
            id: 'sell-btc-1',
            symbol: Symbol.BTC,
            price: 40000,
            user: 'Prasun',
            quantity: 1,
            side: Side.SELL,
            timestamp: Date.now(),
        },
    };
    test('should fail trade with negative quantity', () => {
        const result = AddTrade(testTrades.negativeQuantity);
        expect(result).toEqual('Trade is invalid');
    });
    test('should fail trade with zero quantity', () => {
        const result = AddTrade(testTrades.zeroQuantity);
        expect(result).toEqual('Trade is invalid');
    });
    test('should fail sell trade when quantity is greater than available asset', () => {
        // Portfolio is empty at the start of the test, so any sell should fail.
        const result = AddTrade(testTrades.sellTooMuch);
        expect(result).toEqual('Trade is invalid');
    });
    test('should successfully execute a valid buy trade', () => {
        const result = AddTrade(testTrades.validBuy);
        expect(result).toEqual('Trade executed successfully');
    });
});
// Populate the market with some trades - modularised and abstracted the code out as it eas being reused
function PopulateTrades() {
    const trades = [
        {
            id: 'buy-btc-1',
            symbol: Symbol.BTC,
            price: 40000,
            user: 'Prasun',
            quantity: 1,
            side: Side.BUY,
            timestamp: Date.now(),
        },
        {
            id: 'buy-btc-2',
            symbol: Symbol.BTC,
            price: 42000,
            user: 'Prasun',
            quantity: 1,
            side: Side.BUY,
            timestamp: Date.now(),
        },
        {
            id: 'sell-btc-1',
            symbol: Symbol.BTC,
            price: 43000,
            user: 'Prasun',
            quantity: 1,
            side: Side.SELL,
            timestamp: Date.now(),
        },
    ];
    trades.forEach((trade) => {
        const result = AddTrade(trade);
        expect(result).toEqual('Trade executed successfully');
    });
}
describe('Test_GetPortfolio', () => {
    beforeEach(() => {
        ResetPortfolio();
    });
    test('should pass correctly after a series of trades', () => {
        PopulateTrades();
        // After these trades, the portfolio should reflect:
        // BTC: 1 (bought 2, sold 1)
        // Average Purchase Price: ((40000*1) + (42000*1)) / 2 = 41000
        // Realized Return: (43000 - 41000) * 1 = 2000
        const expectedPortfolio = {
            BTC: {
                averagePurchasePriceUSDT: 41000,
                quantity: 1,
                realizedReturnUSDT: 2000,
            },
            ETH: { averagePurchasePriceUSDT: 0, quantity: 0, realizedReturnUSDT: 0 },
        };
        const portfolio = GetPortFolio();
        expect(portfolio).toEqual(expectedPortfolio);
    });
});
describe('Test_GetProfitAndLossReport', () => {
    beforeEach(() => {
        ResetPortfolio();
    });
    test('should pass correctly after a series of trades', () => {
        PopulateTrades();
        // After these trades, the profit and loss report should reflect:
        // Realized Return: 2000 (from previous test)
        // Unrealized Return: ((44000 - 41000) * 1) = 3000
        const expectedReport = {
            totalReturns: {
                unrealized: 3000,
                realized: 2000,
            },
            individualAssetReturns: [
                {
                    symbol: Symbol.BTC,
                    unrealized: 3000,
                    realized: 2000,
                },
                {
                    symbol: Symbol.ETH,
                    unrealized: 0,
                    realized: 0,
                },
            ],
        };
        const report = GetProfitAndLossReport();
        expect(report).toEqual(expectedReport);
    });
});
//# sourceMappingURL=trade-module.test.js.map