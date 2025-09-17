import express from 'express';
import {
  GetPortFolio,
  GetProfitAndLossReport,
  AddTrade,
} from './trade-module.js';
import type { Trade } from './trade-module.js';
import type { Request, Response } from 'express';

const PORT = 3000;
const app = express();
app.use(express.json()).listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json('I am healthy. Thanks for asking!');
});

app.post('/trade', (req: Request, res: Response) => {
  try {
    const portfolio = AddTrade(req.body as Trade);
    res.status(200).json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get('/portfolio', (req: Request, res: Response) => {
  try {
    const portfolio = GetPortFolio();
    res.status(200).json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get('/profitAndLossReport', (req: Request, res: Response) => {
  try {
    const report = GetProfitAndLossReport();
    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
