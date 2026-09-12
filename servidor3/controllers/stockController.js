const stock = require('../services/stock');

function normalizeItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        const error = new Error('A lista de itens deve ser informada.');
        error.status = 400;
        throw error;
    }

    const quantities = new Map();

    for (const item of items) {
        if (!Number.isInteger(item.CodProduto) || !Number.isInteger(item.Qtd) || item.Qtd <= 0) {
            const error = new Error('Código do produto e quantidade devem ser inteiros positivos.');
            error.status = 400;
            throw error;
        }

        quantities.set(item.CodProduto, (quantities.get(item.CodProduto) || 0) + item.Qtd);
    }

    return quantities;
}

function getStock(req, res) {
    res.json(stock);
}

function lowerStock(req, res) {
    try {
        const quantities = normalizeItems(req.body.Itens);

        for (const [code, quantity] of quantities) {
            const product = stock.find((item) => item.CodProduto === code);

            if (!product) {
                return res.status(400).json({ message: `Produto ${code} não existe no estoque.` });
            }

            if (product.Estoque < quantity) {
                return res.status(409).json({
                    message: `Estoque insuficiente para o produto ${code}. Disponível: ${product.Estoque}.`
                });
            }
        }

        for (const [code, quantity] of quantities) {
            const product = stock.find((item) => item.CodProduto === code);
            product.Estoque -= quantity;
        }

        return res.json({ message: 'Estoque baixado com sucesso.' });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

function replenishStock(req, res) {
    try {
        const quantities = normalizeItems(req.body.Itens);

        for (const code of quantities.keys()) {
            if (!stock.some((item) => item.CodProduto === code)) {
                return res.status(400).json({ message: `Produto ${code} não existe no estoque.` });
            }
        }

        for (const [code, quantity] of quantities) {
            const product = stock.find((item) => item.CodProduto === code);
            product.Estoque += quantity;
        }

        return res.json({ message: 'Estoque reposto com sucesso.' });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}

module.exports = { getStock, lowerStock, replenishStock };
