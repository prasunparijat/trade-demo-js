import { ResponseWriter } from '../utils/common.js';
import { GetPortFolio, GetProfitAndLossReport } from './service.js';

export function GetPortFolioController() {
  try {
    const portfolio = GetPortFolio();
    return ResponseWriter(200, portfolio, undefined);
  } catch (error) {
    return ResponseWriter(400, {}, (error as Error).message);
  }
}

export function GetProfitAndLossReportController() {
  try {
    const PnLReport = GetProfitAndLossReport();
    return ResponseWriter(200, PnLReport, undefined);
  } catch (error) {
    return ResponseWriter(400, {}, (error as Error).message);
  }
}
