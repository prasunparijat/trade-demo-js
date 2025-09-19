import { BadRequestException } from '../exceptions/exceptions.js';
import { Portfolio, Side, type Trade } from '../utils/common.js';
import { INVALID_TRADE_EXCEPTION } from './error_messages.js';
import { CreateTrade } from './repo.js';

// validations can be put into a separate file if this file increases in size
function IsValidTrade(trade: Trade) {
  if (trade.quantity <= 0)
    throw BadRequestException(
      400,
      INVALID_TRADE_EXCEPTION.TRADE_QUANTITY_CANNOT_BE_ZERO_OR_NEGATIVE
    );

  if (trade.price <= 0)
    throw BadRequestException(
      400,
      INVALID_TRADE_EXCEPTION.TRADE_PRICE_CANNOT_BE_ZERO_OR_NEGATIVE
    );

  switch (trade.side) {
    case Side.BUY:
      /* Assume user can always buy (has enough USDT) */
      return;
    case Side.SELL:
      if (Portfolio.get(trade.symbol)!.quantity < trade.quantity)
        throw BadRequestException(
          400,
          INVALID_TRADE_EXCEPTION.NOT_ENOUGH_BALANCE_TO_SELL
        );
  }
}

function UpdatePortfolio(trade: Trade) {
  // Main Business logic to update portfolio
  let {
    quantity: currentQuantity,
    averagePurchasePriceUSDT: currentAveragePurchasePriceUSDT,
    realizedReturnUSDT: currentRealisedReturnUSDT,
  } = Portfolio.get(trade.symbol)!;
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
        realizedReturnUSDT:
          currentRealisedReturnUSDT +
          (trade.price - currentAveragePurchasePriceUSDT) * trade.quantity,
      });
      break;
  }
}

export function AddTrade(trade: Trade): Trade {
  IsValidTrade(trade);
  const createdTrade = CreateTrade(trade);
  UpdatePortfolio(trade);
  return createdTrade;
}
