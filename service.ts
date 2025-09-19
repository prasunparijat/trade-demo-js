import express from 'express';
import type { Request, Response } from 'express';
import { AddTradeController } from './src/trade_module/controller.js';
import {
  GetPortFolioController,
  GetProfitAndLossReportController,
} from './src/report_module/controller.js';
import type { Trade } from './src/utils/common.js';

const PORT = 3000;
const app = express();
app.use(express.json()).listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

// Health Ping
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'I am healthy. Thanks for asking!' });
});

// Endpoints
app.post('/trade', (req: Request, res: Response) => {
  return res.status(res.statusCode).json(AddTradeController(req.body as Trade));
});

app.get('/portfolio', (req: Request, res: Response) => {
  return res.status(res.statusCode).json(GetPortFolioController());
});

app.get('/profitAndLossReport', (req: Request, res: Response) => {
  return res.status(res.statusCode).json(GetProfitAndLossReportController());
});
