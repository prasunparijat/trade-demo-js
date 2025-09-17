export declare const USER = "Prasun";
export declare enum Symbol {
    BTC = "BTC",
    ETH = "ETH"
}
export declare enum Side {
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
export interface AssetTrades {
    [Side.BUY]: Trade[];
    [Side.SELL]: Trade[];
}
export interface Tradebook {
    [Symbol.BTC]: AssetTrades;
    [Symbol.ETH]: AssetTrades;
}
export declare const AllTrades: Tradebook;
interface Asset {
    quantity: number;
    averagePurchasePriceUSDT: number;
    realizedReturnUSDT: number;
}
export declare const Portfolio: Map<Symbol, Asset>;
export declare const CurrentMarketPrices: {
    BTC: number;
    ETH: number;
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
export declare function AddTrade(trade: Trade): "Trade is invalid" | "Trade executed successfully";
export declare function GetPortFolio(): {
    [k: string]: Asset;
};
export declare function GetProfitAndLossReport(): ProfitAndLossReport;
export declare function ResetPortfolio(): void;
export {};
//# sourceMappingURL=trade-module.d.ts.map