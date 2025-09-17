declare enum Symbol {
    BTC = "BTC",
    ETH = "ETH"
}
declare enum Side {
    BUY = "BUY",
    SELL = "SELL"
}
export interface Trade {
    id: string;
    symbol: Symbol;
    side: Side;
    price: number;
    quantity: number;
    timestamp: number;
}
interface Asset {
    quantity: number;
    averagePurchasePriceUSDT: number;
    realizedReturnUSDT: number;
}
interface ProfitAndLossReport {
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
export declare function AddTrade(trade: Trade): "Trade is invalid" | undefined;
export declare function GetPortFolio(): {
    [k: string]: Asset;
};
export declare function GetProfitAndLossReport(): ProfitAndLossReport;
export {};
//# sourceMappingURL=trade-module.d.ts.map