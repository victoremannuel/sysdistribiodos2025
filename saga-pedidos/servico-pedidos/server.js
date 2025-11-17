const express = require("express");
const app = express();
app.use(express.json());

let pedidos = {}; // banco em memória

app.post("/pedidos", (req, res) => {
    const id = "pedido-" + Date.now();
    pedidos[id] = {
        pedidoId: id,
        status: "PENDENTE",
        ...req.body
    };
    return res.status(201).json(pedidos[id]);
});

app.put("/pedidos/:id/status", (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    if (!pedidos[id]) {
        return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    pedidos[id].status = status;
    return res.json(pedidos[id]);
});

app.listen(3001, () => console.log("servico-pedidos rodando na 3001"));
