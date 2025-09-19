import { ResponseWriter, type Trade } from '../utils/common.js';
import { AddTrade } from './service.js';

// For larger applications, we can use NestJs and a proper DI + Swagger Docs + Doc Comments + Same Function name across the layers
export function AddTradeController(trade: Trade) {
  try {
    const createdTrade = AddTrade(trade);
    return ResponseWriter(201, createdTrade, undefined);
  } catch (error) {
    return ResponseWriter(400, {}, (error as Error).message);
  }
}
