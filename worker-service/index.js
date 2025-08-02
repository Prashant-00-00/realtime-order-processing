import express from "express";
import { kafka } from "./kafka-config.js";
import { Order } from "./db.js";

const app = express();

const consumer = kafka.consumer({ groupId: "order-group" });
const admin = kafka.admin();

async function ensureTopicExists(topicName) {
  await admin.connect();
  const topics = await admin.listTopics();

  if (!topics.includes(topicName)) {
    console.log(`Topic "${topicName}" does not exist. Creating...`);
    await admin.createTopics({
      topics: [{ topic: topicName, numPartitions: 1, replicationFactor: 1 }],
    });
    console.log(`Topic "${topicName}" created.`);
  } else {
    console.log(`Topic "${topicName}" already exists.`);
  }

  await admin.disconnect();
}

async function startWorker() {
  const topicName = "orders";

  // Ensure topic exists before consuming
  await ensureTopicExists(topicName);

  await consumer.connect();
  await consumer.subscribe({ topic: topicName, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const orderData = JSON.parse(message.value.toString());
        console.log("New order received:", orderData);

        const newOrder = new Order(orderData);
        await newOrder.save();

        console.log("Order saved to DB:", newOrder);
      } catch (err) {
        console.error("Failed to process order:", err);
      }
    },
  });

  console.log("Worker is now consuming messages...");
}

startWorker().catch(console.error);

app.listen(3001, () => {
  console.log("Worker service running on port 3001");
});
