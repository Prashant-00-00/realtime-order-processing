import express from "express";
import { checkbody } from "./config.js";
import { kafka } from "./kafka/kafka-config.js";
import { Order } from "./db.js";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const producer = kafka.producer();
const admin = kafka.admin();

async function ensureTopicExists(topicName) {
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics.includes(topicName)) {
        console.log(`Topic "${topicName}" not found. Creating...`);
        await admin.createTopics({
            topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
            waitForLeaders: true
        });
        console.log(`Topic "${topicName}" created.`);
    } else {
        console.log(`Topic "${topicName}" already exists.`);
    }
    await admin.disconnect();
}

await ensureTopicExists("orders");
await producer.connect();

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({ status: "Awaiting" }).sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

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

app.patch("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["Preparing", "Declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
    console.log("Order service running on port 3000");
});
