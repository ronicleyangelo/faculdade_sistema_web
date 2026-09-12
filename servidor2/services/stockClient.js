const stockServerUrl = process.env.STOCK_SERVER_URL || 'http://localhost:3002';

async function requestStock(path, options = {}) {
    let response;

    try {
        response = await fetch(`${stockServerUrl}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
    } catch {
        const error = new Error('Servidor de estoque indisponível.');
        error.status = 503;
        throw error;
    }

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'Erro no servidor de estoque.');
        error.status = response.status;
        throw error;
    }

    return data;
}

function getStock() {
    return requestStock('/estoque');
}

function lowerStock(items) {
    return requestStock('/baixa', {
        method: 'POST',
        body: JSON.stringify({ Itens: items })
    });
}

module.exports = { getStock, lowerStock };
