function getHealth(req, res) {
    res.json({
        status: 'ok',
        message: 'Backend conectado com sucesso',
        timestamp: new Date().toISOString()
    });
}

module.exports = { getHealth };