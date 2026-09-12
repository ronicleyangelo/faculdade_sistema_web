const express = require('express');
const { getStock, lowerStock, replenishStock } = require('../controllers/stockController');

const router = express.Router();

router.get('/estoque', getStock);
router.post('/baixa', lowerStock);
router.post('/reposicao', replenishStock);

module.exports = router;
