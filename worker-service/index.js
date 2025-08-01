import express from "express";
import { kafka } from "./kafka-config.js";
import { Order } from "./db.js";
const app = express();
const consumer = kafka.consumer({ groupId: 'order-group' })

await consumer.connect()
await consumer.subscribe({ topic: 'orders', fromBeginning: false })

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

app.listen(3001, () => {
  console.log("Worker service running on port 3001");
});