const express = require("express");
const app = express();
app.use(express.json());

let pagamentos = {};

app.post("/pagamentos", (req, res) => {
    const { pedidoId, produtoId, valor } = req.body;

    // Simulação de falha proposital
    if (produtoId === 0 || valor >= 1000) {
        return res.status(400).json({ erro: "Pagamento recusado" });
    }

    const id = "pag-" + Date.now();
    pagamentos[id] = { pagamentoId: id, pedidoId, status: "APROVADO" };

    return res.status(201).json(pagamentos[id]);
});

app.post("/pagamentos/:id/reembolso", (req, res) => {
    const id = req.params.id;

    if (!pagamentos[id]) {
        return res.status(404).json({ erro: "Pagamento não encontrado" });
    }

    pagamentos[id].status = "REEMBOLSADO";
    return res.json(pagamentos[id]);
});

app.listen(3002, () => console.log("servico-pagamentos na 3002"));
