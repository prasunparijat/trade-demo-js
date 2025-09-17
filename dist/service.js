import express from 'express';
import { GetPortFolio, GetProfitAndLossReport, AddTrade, } from './trade-module.js';
const PORT = 3000;
const app = express();
app.use(express.json()).listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
app.get('/health', (req, res) => {
    res.status(200).json('I am healthy. Thanks for asking!');
});
app.post('/trade', (req, res) => {
    try {
        const portfolio = AddTrade(req.body);
        res.status(200).json(portfolio);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
app.get('/portfolio', (req, res) => {
    try {
        const portfolio = GetPortFolio();
        res.status(200).json(portfolio);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
app.get('/profitAndLossReport', (req, res) => {
    try {
        const report = GetProfitAndLossReport();
        res.status(200).json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
//# sourceMappingURL=service.js.map