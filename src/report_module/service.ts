import {
  CurrentMarketPrices,
  Portfolio,
  type ProfitAndLossReport,
} from '../utils/common.js';

export function GetPortFolio() {
  return Object.fromEntries(Portfolio);
}

function initialiseReport(): ProfitAndLossReport {
  const Report: ProfitAndLossReport = {
    totalReturns: {
      unrealized: 0,
      realized: 0,
    },
    individualAssetReturns: [],
  };
  return Report;
}

function populateReport(Report: ProfitAndLossReport): ProfitAndLossReport {
  for (const [
    symbol,
    { quantity, averagePurchasePriceUSDT, realizedReturnUSDT },
  ] of Portfolio.entries()) {
    const unrealized =
      (CurrentMarketPrices[symbol] - averagePurchasePriceUSDT) * quantity;
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

export function GetProfitAndLossReport() {
  const initialisedReport: ProfitAndLossReport = initialiseReport();
  const Report = populateReport(initialisedReport);
  return Report;
}
