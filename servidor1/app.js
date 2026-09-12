const path = require('path');
const express = require('express');

const app = express();
const port = process.env.STATIC_SERVER_PORT || 3000;
const frontendPath = path.resolve(__dirname, 'public');

app.use(express.static(frontendPath));

app.listen(port, () => {
    console.log(`Servidor 1 (páginas) rodando em http://localhost:${port}`);
});

module.exports = app;
