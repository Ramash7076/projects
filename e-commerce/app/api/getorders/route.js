
import connectDb from "@/db/connectDb"
import Order from "@/models/Order"


export async function GET() {

    await connectDb()
    const orders = await Order.find()
    return Response.json({ orders })
}