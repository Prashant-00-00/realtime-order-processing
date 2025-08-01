import express from "express";
import { checkbody } from "./config.js";
import { kafka } from "./kafka/kafka-config.js";

const app = express();
app.use(express.json());

const producer = kafka.producer();

await producer.connect();

app.post('/order', async (req, res) => {
    const body = req.body;

    const parsedBody = checkbody.safeParse(body);

    if (!parsedBody.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: parsedBody.error.errors 
        });
    }

    try {
        await producer.send({
            topic: 'orders',
            messages: [
                { value: JSON.stringify(parsedBody.data) }, 
            ],
        });

        res.status(200).json({ message: "Order sent to Kafka successfully" });
    } catch (err) {
        console.error("Error sending to Kafka:", err);
        res.status(500).json({ message: "Failed to send order to Kafka" });
    }
});

app.listen(3000, () => {
    console.log("Order service running on port 3000");
});
