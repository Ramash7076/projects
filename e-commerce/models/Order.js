import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    OrderId: {type: String, required: true},
    transactionId: {type: String, default: ""},
    paymentInfo: {type: String, default: ""},
    products: {type: Object, required: true},
    amount: {type: Number, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    pincode: {type: Number, required: true},
    phone: {type: Number, required: true},
    status: {type: String, default: 'Pending', required: true},
    
}, {timestamps: true})

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);