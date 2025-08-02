import { Kafka } from "kafkajs";

const clientId = "realtime-order-app";
const brokers = [process.env.KAFKA_BROKER || "broker:29092"];

export const kafka = new Kafka({
  clientId,
  brokers
});
