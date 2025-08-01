import mongoose from "mongoose";
await mongoose.connect('mongodb+srv://prashant:RbZhgAXkd1YF9O9I@prashant-cluster.a3uiuae.mongodb.net/realtime-orders')

const orderSchema = new mongoose.Schema({
    item: String,
    quantity: Number,
    status: String,
    timestamp: { type: Date, default: Date.now }    
})

export const Order = mongoose.model('Order', orderSchema)