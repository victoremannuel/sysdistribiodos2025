const express = require("express");
const app = express();
app.use(express.json());

let estoque = { "produto-abc": 100 }; // estoque inicial

app.post("/estoque/reserva", (req, res) => {
    const { produtoId, quantidade } = req.body;

    if (!estoque[produtoId] || estoque[produtoId] < quantidade) {
        return res.status(400).json({ erro: "Estoque insuficiente" });
    }

    estoque[produtoId] -= quantidade;

    return res.json({
        produtoId,
        estoque_restante: estoque[produtoId]
    });
});

app.post("/estoque/liberacao", (req, res) => {
    const { produtoId, quantidade } = req.body;

    estoque[produtoId] += quantidade;

    return res.json({
        produtoId,
        estoque_restante: estoque[produtoId]
    });
});

app.listen(3003, () => console.log("servico-estoque rodando na 3003"));
