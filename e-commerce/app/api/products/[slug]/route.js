import Product from "@/models/Product";
import connectDb from "@/db/connectDb";

export async function GET(req, { params }) {
  try {
    await connectDb();
    const { slug } = params;

    const product = await Product.findOne({ slug });

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product:", err);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
