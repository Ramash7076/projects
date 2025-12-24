import Product from "@/models/Product"
import connectDb from "@/db/connectDb"


export async function GET() {

  await connectDb()
  const products = await Product.find()
  return Response.json({products})
}