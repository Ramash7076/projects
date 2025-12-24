import Product from "@/models/Product"
import connectDb from "@/db/connectDb"
import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary";


export async function POST(req) {

  await connectDb()
  const data = await req.json()
  let newProduct = await Product.create(data)
  
  return NextResponse.json({success: true, product: newProduct}) 
} 




export async function DELETE(req) {
  try {
    await connectDb();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    // 1️⃣ Find product first
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" }, 
        { status: 404 }
      );
    }

    // 2️⃣ Delete images from Cloudinary
    if (product.images?.length) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    // 3️⃣ Delete product from DB
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
