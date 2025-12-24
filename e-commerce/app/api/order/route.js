import connectDb from "@/db/connectDb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const { oid } = await req.json();
    await connectDb();

    const order = await Order.findOne({ OrderId: oid });

    if (!order) {
      return Response.json({ success: false, message: "Order not found" });
    }

    let amount = 0;
    for (const item of Object.values(order.products)) {
      amount += item.price * item.qty;
    }

    return Response.json({ success: true, order, amount });
  } catch (error) {
    return Response.json({ success: false, message: "Server error" });
  }
}
