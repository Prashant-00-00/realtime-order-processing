import { kafka } from "./kafka-config.js"

const producer = kafka.producer()

await producer.connect()
await producer.send({
  topic: 'orders',
  messages: [
    { value: 'Hello KafkaJS user!' },
  ],
})

await producer.disconnect()