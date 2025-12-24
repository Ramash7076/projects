import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Order from "@/models/Order";

// Razorpay official verification util
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    // const {
    //   razorpay_payment_id,
    //   razorpay_order_id,
    //   razorpay_signature,
    //   orderId,
    // } = body;

    // 1️⃣ Signature Verification (Official Razorpay Method)
    let isValid = false;

    try {
      isValid = validatePaymentVerification(
        {
          order_id: body.razorpay_order_id,
          payment_id: body.razorpay_payment_id,
        },
        body.razorpay_signature,
        process.env.RAZORPAY_KEY_SECRET
      );
    } catch (err) {
      isValid = false;
    }
 
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid Signature ❌" },
        { status: 400 }
      );
    }

    // 2️⃣ Update Order in DB
    const updatedOrder = await Order.findOneAndUpdate(
      { OrderId: body.orderId },
      {
        status: "Paid",
        paymentInfo: JSON.stringify(body),
        transactionId: body.razorpay_payment_id
      },
      { new: true }
    );

    let product = updatedOrder.products
    for(let slug in product){
      await Product.findOneAndUpdate({slug: slug}, {$inc: {"availableQty": - product[slug].qty}})
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    

    return NextResponse.json({
      success: true,
      message: "Payment Verified Successfully ✔",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("POSTTRANSACTION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
