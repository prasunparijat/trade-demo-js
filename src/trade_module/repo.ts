import { AllTrades, type Trade } from '../utils/common.js';

// This function simluates a DB write
export function CreateTrade(trade: Trade): Trade {
  AllTrades[trade.symbol][trade.side].push(trade);
  return trade;
}
