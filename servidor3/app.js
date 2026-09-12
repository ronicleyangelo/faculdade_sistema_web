const express = require('express');
const stockRoutes = require('./routes/stockRoutes');

const app = express();
const port = process.env.STOCK_SERVER_PORT || 3002;

app.use(express.json());
app.use(stockRoutes);

app.listen(port, () => {
    console.log(`Servidor 3 (estoque) rodando em http://localhost:${port}`);
});

module.exports = app;
