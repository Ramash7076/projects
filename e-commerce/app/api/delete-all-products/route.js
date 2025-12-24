import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

export async function DELETE() {
  try {
    await connectDb();

    // 1️⃣ Get all products
    const products = await Product.find({}, { images: 1 });

    // 2️⃣ Collect public_ids
    const publicIds = [];

    products.forEach((product) => {
      if (product.images) {
        Object.values(product.images).forEach((img) => {
          if (img.public_id) {
            publicIds.push(img.public_id);
          }
        });
      }
    });

    // 3️⃣ Delete images from Cloudinary
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    // 4️⃣ Delete all products from DB
    const result = await Product.deleteMany({});

    return NextResponse.json({
      success: true,
      deletedProducts: result.deletedCount,
      deletedImages: publicIds.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
