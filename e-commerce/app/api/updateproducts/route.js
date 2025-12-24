import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

export async function PUT(req) {
  try {
    await connectDb();

    const {
      id,
      name,
      slug,
      price,
      category,
      desc,
      availableQty,
      images,
      removedImagePublicIds = [],
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID required" },
        { status: 400 }
      );
    }

    // 1️⃣ Delete removed images from Cloudinary
    if (removedImagePublicIds.length > 0) {
      await cloudinary.api.delete_resources(removedImagePublicIds);
    }

    // 2️⃣ Update product in DB
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        price,
        category: category.toLowerCase(),
        desc,
        availableQty,
        images,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
