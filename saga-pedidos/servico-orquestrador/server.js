const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const PEDIDOS  = process.env.PEDIDOS_URL  || "http://localhost:3001";
const PAGAMENTOS = process.env.PAGAMENTOS_URL || "http://localhost:3002";
const ESTOQUE = process.env.ESTOQUE_URL || "http://localhost:3003";

app.post("/processar-pedido", async (req, res) => {
    const payload = req.body;
    let pedido, pagamento;

    try {
        // 1. cria pedido
        const r1 = await axios.post(`${PEDIDOS}/pedidos`, payload);
        pedido = r1.data;
        console.log(`Pedido ${pedido.pedidoId} criado`);

        // 2. processa pagamento
        const r2 = await axios.post(`${PAGAMENTOS}/pagamentos`, {
            pedidoId: pedido.pedidoId,
            produtoId: payload.produtoId,
            valor: payload.valor
        });
        pagamento = r2.data;
        console.log(`Pagamento ${pagamento.pagamentoId} processado`);

        // 3. reserva estoque
        await axios.post(`${ESTOQUE}/estoque/reserva`, {
            pedidoId: pedido.pedidoId,
            produtoId: payload.produtoId,
            quantidade: payload.quantidade
        });
        console.log(`Estoque reservado para o pedido ${pedido.pedidoId}`);

        // 4. confirma pedido (sucesso)
        await axios.put(`${PEDIDOS}/pedidos/${pedido.pedidoId}/status`, {
            status: "CONFIRMADO"
        });
        console.log(`Pedido ${pedido.pedidoId} confirmado`);

        return res.status(201).json({
            pedidoId: pedido.pedidoId,
            status: "PEDIDO_CONFIRMADO"
        });

    } catch (erro) {
        console.log("Falha detectada, iniciando compensações...");

        // compensação estoque
        if (pedido) {
            await axios.post(`${ESTOQUE}/estoque/liberacao`, {
                produtoId: payload.produtoId,
                quantidade: payload.quantidade
            }).catch(() => {});
            console.log("Estoque compensado");
        }

        // estorno pagamento
        if (pagamento) {
            await axios.post(`${PAGAMENTOS}/pagamentos/${pagamento.pagamentoId}/reembolso`)
            .catch(() => {});
            console.log("Pagamento estornado");
        }

        // cancela pedido
        if (pedido) {
            await axios.put(`${PEDIDOS}/pedidos/${pedido.pedidoId}/status`, {
                status: "CANCELADO"
            }).catch(() => {});
            console.log("Pedido cancelado");
        }

        return res.status(500).json({
            erro: "A saga falhou",
            motivo: erro.response?.data || erro.message,
            pedidoId: pedido?.pedidoId
        });
    }
});

app.listen(3000, () => console.log("servico-orquestrador rodando na 3000"));
