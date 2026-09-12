const express = require('express');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.ORDER_SERVER_PORT || 3001;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    return next();
});

app.use(express.json());
app.use(orderRoutes);

app.listen(port, () => {
    console.log(`Servidor 2 (pedidos) rodando em http://localhost:${port}`);
});

module.exports = app;
