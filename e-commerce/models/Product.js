import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [ { url: String, public_id: String }], 
    availableQty: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Product || mongoose.model("Product", ProductSchema)
