import {
  GetPortFolioController,
  GetProfitAndLossReportController,
} from '../src/report_module/controller.js';
import { PopulateTrades, ResetPortfolio } from './utils/common.js';

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
      data: {
        BTC: {
          averagePurchasePriceUSDT: 41000,
          quantity: 1,
          realizedReturnUSDT: 2000,
        },
        ETH: {
          averagePurchasePriceUSDT: 0,
          quantity: 0,
          realizedReturnUSDT: 0,
        },
      },
      errorMessage: undefined,
      status: 200,
    };

    const portfolio = GetPortFolioController();
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
      data: {
        individualAssetReturns: [
          {
            realized: 2000,
            symbol: 'BTC',
            unrealized: 3000,
          },
          {
            realized: 0,
            symbol: 'ETH',
            unrealized: 0,
          },
        ],
        totalReturns: {
          realized: 2000,
          unrealized: 3000,
        },
      },
      errorMessage: undefined,
      status: 200,
    };
    const report = GetProfitAndLossReportController();
    expect(report).toEqual(expectedReport);
  });
});
