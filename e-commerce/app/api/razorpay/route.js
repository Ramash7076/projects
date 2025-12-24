import Razorpay from "razorpay";
import connectDb from "@/db/connectDb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import pincodes from '@/pincodes.json'

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    let sumTotal = 0;
    let cart = body.cartItems;

    if (body.subtotal <= 0) {
      return Response.json({ success: false, message: "Cart Empty! Please build your cart and try again!", cartClear:true });
    }
    if (!Object.keys(pincodes).includes(body.pincode)) {
      return Response.json({ success: false, message: "The pincode you have entered is not serviceable", cartClear: false });
    }


    // Validate cart tampering
    for (let slug in cart) {
      const item = cart[slug];

      const product = await Product.findOne({ slug });

      // check if the cart items are out of stock
      if(product.availableQty < item.qty){
        return Response.json({ success: false, message: "Your cart items went out of stock. Please try again!", cartClear:true });
      }

      if (!product || product.price !== item.price) {
        return Response.json({ success: false, message: "Some items in your cart has changed. Please try again!", cartClear:true });
      }

      sumTotal += item.price * item.qty;
    }

    if (sumTotal !== body.subtotal) {
      return Response.json({ success: false, message: "Some items in your cart has changed. Please try again!", cartClear:true });
    }

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: body.subtotal * 100,
      currency: "INR",
      receipt: `receipt_${body.oid}`,
      notes: {
        email: body.email,
        items: JSON.stringify(body.cartItems),
      },
    };

    const order = await instance.orders.create(options);

    // Save order in DB
    await Order.findOneAndUpdate(
      { OrderId: body.oid },
      {
        name: body.name,
        email: body.email,
        address: body.address,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        phone: body.phone,
        amount: body.subtotal,
        products: body.cartItems,
        status: "Pending",
      },
      { upsert: true, new: true }
    );

    return Response.json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Razorpay Error:", error);
    return Response.json({ success: false, message: error.message });
  }
}
