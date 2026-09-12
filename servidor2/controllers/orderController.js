const products = require('../models/products');
const { closeOrder, createOrder, listOrders } = require('../models/orders');
const { getStock, lowerStock } = require('../services/stockClient');

function sendError(res, error) {
    return res
        .status(error.status || 500)
        .json({ message: error.message || 'Erro interno do servidor.' });
}

async function getProducts(req, res) {
    try {
        const stock = await getStock();
        const catalog = products.map((product) => {
            const stockItem = stock.find((item) => item.CodProduto === product.CodProduto);

            return { ...product, Estoque: stockItem ? stockItem.Estoque : 0 };
        });

        return res.json(catalog);
    } catch (error) {
        return sendError(res, error);
    }
}

async function createOrderRequest(req, res) {
    try {
        const { NomeCliente, Itens } = req.body;

        if (typeof NomeCliente !== 'string' || NomeCliente.trim() === '') {
            const error = new Error('O nome do cliente é obrigatório.');
            error.status = 400;
            throw error;
        }

        if (!Array.isArray(Itens) || Itens.length === 0) {
            const error = new Error('O pedido deve possuir pelo menos um item.');
            error.status = 400;
            throw error;
        }

        const orderItems = [];
        const usedCodes = new Set();

        for (const item of Itens) {
            if (
                !Number.isInteger(item.CodProduto) ||
                !Number.isInteger(item.Qtd) ||
                item.Qtd <= 0
            ) {
                const error = new Error(
                    'Código do produto e quantidade devem ser inteiros positivos.'
                );
                error.status = 400;
                throw error;
            }

            if (usedCodes.has(item.CodProduto)) {
                const error = new Error('Não repita produtos no mesmo pedido.');
                error.status = 400;
                throw error;
            }

            const product = products.find((itemData) => itemData.CodProduto === item.CodProduto);

            if (!product) {
                const error = new Error(`Produto ${item.CodProduto} não existe.`);
                error.status = 400;
                throw error;
            }

            usedCodes.add(item.CodProduto);
            orderItems.push({ ...product, Qtd: item.Qtd });
        }

        await lowerStock(Itens);

        const order = createOrder({
            NomeCliente: NomeCliente.trim(),
            TotalPedido: orderItems.reduce((total, item) => total + item.Preco * item.Qtd, 0),
            Itens: orderItems
        });

        return res.status(201).json(order);
    } catch (error) {
        return sendError(res, error);
    }
}

function getOrders(req, res) {
    res.json(listOrders());
}

function closeOrderRequest(req, res) {
    const orderNumber = Number(req.params.id);

    if (!Number.isInteger(orderNumber)) {
        return res.status(400).json({ message: 'Número do pedido inválido.' });
    }

    if (!closeOrder(orderNumber)) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    return res.json({ message: 'Pedido fechado com sucesso.' });
}

module.exports = { getProducts, createOrderRequest, getOrders, closeOrderRequest };
