import mongoose from "mongoose";
await mongoose.connect(process.env.MONGO_URI);

const orderSchema = new mongoose.Schema({
    item: String,
    quantity: Number,
    status: { type: String, default: "Awaiting" }, 
    timestamp: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);
