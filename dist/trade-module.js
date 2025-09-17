// Assume a single user + in memory + no auth + FIFO
// User is Prasun
export const USER = 'Prasun';
// Supported symbols
export var Symbol;
(function (Symbol) {
    Symbol["BTC"] = "BTC";
    Symbol["ETH"] = "ETH";
})(Symbol || (Symbol = {}));
// Supported Sides
export var Side;
(function (Side) {
    Side["BUY"] = "BUY";
    Side["SELL"] = "SELL";
})(Side || (Side = {}));
// In-memory instance for all trades for the user
export const AllTrades = {
    [Symbol.BTC]: {
        [Side.BUY]: [],
        [Side.SELL]: [],
    },
    [Symbol.ETH]: {
        [Side.BUY]: [],
        [Side.SELL]: [],
    },
};
// Initialise portfolio with default of 0 BTC and ETH
export const Portfolio = new Map([
    [
        Symbol.BTC,
        { quantity: 0, averagePurchasePriceUSDT: 0, realizedReturnUSDT: 0 },
    ],
    [
        Symbol.ETH,
        { quantity: 0, averagePurchasePriceUSDT: 0, realizedReturnUSDT: 0 },
    ],
]);
function isValidTrade(trade) {
    if (trade.quantity <= 0)
        return false;
    switch (trade.side) {
        case Side.BUY:
            return true; // Assuming user can always buy (has enough USDT)
        case Side.SELL:
            return Portfolio.get(trade.symbol).quantity >= trade.quantity;
    }
}
function ExecuteTrade(trade) {
    // Just a ledger
    AllTrades[trade.symbol][trade.side].push(trade);
    // Main logic to update portfolio
    let { quantity: currentQuantity, averagePurchasePriceUSDT: currentAveragePurchasePriceUSDT, realizedReturnUSDT: currentRealisedReturnUSDT, } = Portfolio.get(trade.symbol);
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
                realizedReturnUSDT: currentRealisedReturnUSDT +
                    (trade.price - currentAveragePurchasePriceUSDT) * trade.quantity,
            });
            break;
    }
}
export const CurrentMarketPrices = {
    [Symbol.BTC]: 44000,
    [Symbol.ETH]: 2000,
};
export function AddTrade(trade) {
    // Here assuming that the trade is valid from the structural aspect / would have used validate Trade (Even better in nestjs we use class-validator at the DTO level itself for various sanity checks and request sanitisations)
    // validate the trade from the business logic aspect
    if (!isValidTrade(trade))
        return 'Trade is invalid';
    ExecuteTrade(trade);
    return 'Trade executed successfully';
}
export function GetPortFolio() {
    return Object.fromEntries(Portfolio);
}
export function GetProfitAndLossReport() {
    let Report = {
        totalReturns: {
            unrealized: 0,
            realized: 0,
        },
        individualAssetReturns: [],
    };
    for (const [symbol, { quantity, averagePurchasePriceUSDT, realizedReturnUSDT },] of Portfolio.entries()) {
        const unrealized = (CurrentMarketPrices[symbol] - averagePurchasePriceUSDT) * quantity;
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
//# sourceMappingURL=trade-module.js.map