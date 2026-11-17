require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Health check
 */
app.get("/", (req, res) => {
    res.json({
        status: "online",
        service: "WhatsApp Cloud API"
    });
});

/**
 * VERIFICAÇÃO DO WEBHOOK DA META
 */
app.get("/webhook/whatsapp", (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Verificação de webhook recebida");

    if (
        mode === "subscribe" &&
        token === process.env.META_VERIFY_TOKEN
    ) {

        console.log("Webhook verificado com sucesso");

        return res.status(200).send(challenge);
    }

    console.log("Falha na verificação do webhook");

    return res.sendStatus(403);
});

/**
 * RECEBIMENTO DAS MENSAGENS DA META
 */
app.post("/webhook/whatsapp", async (req, res) => {

    try {

        console.log(
            "Webhook recebido da Meta:"
        );

        console.log(
            JSON.stringify(req.body, null, 2)
        );

        /*
         * A Meta espera uma resposta rápida.
         */
        res.sendStatus(200);

        const message =
            req.body?.entry?.[0]
                ?.changes?.[0]
                ?.value?.messages?.[0];

        if (!message) {
            console.log("Evento sem mensagem.");
            return;
        }

        const phone = message.from;

        const type = message.type;

        let text = "";

        if (type === "text") {
            text = message.text?.body || "";
        }

        /*
         * Ignorar mensagens que não sejam texto
         * por enquanto.
         */
        if (!text) {
            console.log(
                `Mensagem do tipo ${type} ignorada.`
            );

            return;
        }

        const data = {
            messageId: message.id,
            phone,
            type,
            message: text
        };

        console.log(
            "Enviando para n8n:"
        );

        console.log(data);

        await axios.post(
            process.env.N8N_WEBHOOK_URL,
            data
        );

        console.log(
            "Mensagem enviada para o n8n."
        );

    } catch (error) {

        console.error(
            "Erro no webhook:",
            error.response?.data ||
            error.message
        );
    }
});

/**
 * ENVIO DE MENSAGEM PARA O WHATSAPP
 */
app.post("/whatsapp/send", async (req, res) => {

    try {

        const {
            phone,
            message
        } = req.body;

        if (!phone || !message) {

            return res.status(400).json({
                success: false,
                error:
                    "phone e message são obrigatórios"
            });
        }

        const url =
            `https://graph.facebook.com/vXX.X/` +
            `${process.env.META_PHONE_NUMBER_ID}` +
            `/messages`;

        const response = await axios.post(
            url,
            {
                messaging_product: "whatsapp",

                to: phone,

                type: "text",

                text: {
                    body: message
                }
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.META_ACCESS_TOKEN}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );

        console.log(
            "Mensagem enviada para:",
            phone
        );

        res.json({
            success: true,
            data: response.data
        });

    } catch (error) {

        console.error(
            "Erro ao enviar mensagem:",
            error.response?.data ||
            error.message
        );

        res.status(500).json({
            success: false,
            error:
                error.response?.data ||
                error.message
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `WhatsApp API rodando na porta ${PORT}`
    );

});