import Order from "@/models/Order";
import connectDb from "@/db/connectDb";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { token } = body;

    if (!token) {
      return Response.json(
        { success: false, message: "Token missing!" },
        { status: 400 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json(
        { success: false, message: "Invalid token!" },
        { status: 401 }
      );
    }

    const orders = await Order.find({ email: decoded.email, status: "Paid" });

    return Response.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("MYORDERS API ERROR:", error);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
