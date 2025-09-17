// Assume a single user + in memory + no auth + FIFO
// User is Prasun
const USER = 'Prasun';
// Supported symbols
var Symbol;
(function (Symbol) {
    Symbol["USDT"] = "USDT";
    Symbol["BTC"] = "BTC";
    Symbol["ETH"] = "ETH";
})(Symbol || (Symbol = {}));
// Supported Sides
var Side;
(function (Side) {
    Side["BUY"] = "BUY";
    Side["SELL"] = "SELL";
})(Side || (Side = {}));
// Initial USDT balance - to execute the trades
const Portfolio = [
    { unit: Symbol.USDT, value: 100000, averagePurchasePriceUSDT: 1 },
    { unit: Symbol.BTC, value: 10, averagePurchasePriceUSDT: 1000 },
    { unit: Symbol.ETH, value: 10, averagePurchasePriceUSDT: 100 },
];
const AllTrades = [];
// In-memory storage for portfolios and market (orderbook)
const Market = {
    [Symbol.USDT]: {
        [Side.BUY]: [],
        [Side.SELL]: [],
    },
    [Symbol.BTC]: {
        [Side.BUY]: [],
        [Side.SELL]: [],
    },
    [Symbol.ETH]: {
        [Side.BUY]: [],
        [Side.SELL]: [],
    },
};
function ExecuteTrade(trade, side) {
    AllTrades.push(trade);
    switch (side) {
        case Side.BUY:
            Portfolio.find((p) => p.unit === trade.symbol).value += trade.quantity;
            Portfolio.find((p) => p.unit === Symbol.USDT).value -=
                trade.quantity * trade.price;
            break;
        case Side.SELL:
            Portfolio.find((p) => p.unit === trade.symbol).value -= trade.quantity;
            Portfolio.find((p) => p.unit === Symbol.USDT).value +=
                trade.quantity * trade.price;
            break;
    }
}
function MatchFIFO(buyOrders, sellOrders) {
    const tradeCount = 0;
    while (buyOrders.length > 0 && sellOrders.length > 0) {
        const { quantity: buyQuantity, price: buyPrice } = buyOrders[0];
        const { quantity: sellQuantity, price: sellPrice } = sellOrders[0];
        if (buyPrice < sellPrice)
            break; // No match possible
        const matchedQuantity = Math.min(buyQuantity, sellQuantity);
        const remainingBuyQuantity = buyQuantity - matchedQuantity;
        const remainingSellQuantity = sellQuantity - matchedQuantity;
        ExecuteTrade({
            id: `trade-${Date.now()}`,
            symbol: buyOrders[0]?.symbol,
            price: sellOrders[0]?.price,
            user: USER,
            quantity: matchedQuantity,
            timestamp: Date.now(),
        }, Math.random() > 0.5 ? Side.SELL : Side.BUY);
        // Remove fully matched orders
        if (remainingBuyQuantity === 0) {
            buyOrders.shift();
        }
        if (remainingSellQuantity === 0) {
            sellOrders.shift();
        }
    }
    console.log('Trades executed:', tradeCount);
}
function isValidTrade(order) {
    if (order.symbol != Symbol.USDT) {
        console.error('Invalid symbol');
        return false;
    }
    switch (order.side) {
        case Side.BUY:
            return (Portfolio.find((p) => p.unit === Symbol.USDT)?.value >= order.quantity);
        case Side.SELL:
            return (Portfolio.find((p) => p.unit === order.symbol)?.value >= order.quantity);
        default:
            return false;
    }
}
function AddTrade(order) {
    // Here assuming that the trade is valid from the structural aspect / would have used validate Trade (Even better in nestjs we use class-validator at the DTO level itself for various sanity checks and request sanitisations)
    // validate the trade from the business logic aspect
    if (!isValidTrade(order))
        return 'Trade is invalid';
    Market[order.symbol][order.side].push(order);
    // Try to match orders
    MatchFIFO(Market[order.symbol][Side.BUY], Market[order.symbol][Side.SELL]);
}
export {};
//# sourceMappingURL=index_1st.js.map