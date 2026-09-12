const orders = [];

let nextOrderNumber = 1;

function createOrder(orderData) {
    const order = {
        NumeroPedido: nextOrderNumber,
        ...orderData
    };

    nextOrderNumber += 1;
    orders.push(order);
    return order;
}

function listOrders() {
    return orders;
}

function closeOrder(orderNumber) {
    const index = orders.findIndex((order) => order.NumeroPedido === orderNumber);

    if (index === -1) {
        return false;
    }

    orders.splice(index, 1);
    return true;
}

module.exports = { createOrder, listOrders, closeOrder };
