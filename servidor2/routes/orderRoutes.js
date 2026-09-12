const express = require('express');
const {
    closeOrderRequest,
    createOrderRequest,
    getOrders,
    getProducts
} = require('../controllers/orderController');

const router = express.Router();

router.get('/produtos', getProducts);
router.post('/pedidos', createOrderRequest);
router.get('/pedidos', getOrders);
router.post('/pedidos/:id/fechar', closeOrderRequest);

module.exports = router;
