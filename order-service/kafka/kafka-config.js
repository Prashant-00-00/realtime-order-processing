import { Kafka } from "kafkajs";
const clientId = "realtime-order-app"
const brokers = ["localhost:9092"]
export const kafka = new Kafka({ clientId, brokers })