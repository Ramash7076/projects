import User from "@/models/User";
import connectDb from "@/db/connectDb";
import jwt from "jsonwebtoken";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(req) {
    try {
        await connectDb();

        const body = await req.json();
        if (!body.token) {
            return Response.json({ success: false, message: "No token provided" }, { status: 400 });
        }

        // Verify JWT
        const user = jwt.verify(body.token, process.env.JWT_SECRET);

        // Fetch user from DB
        const dbuser = await User.findOne({ email: user.email });


        if (!dbuser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const { name, email, address, pincode, phone } = dbuser

        return Response.json({
            success: true,
            name, email, address, pincode, phone
        });

    } catch (err) {
        return Response.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function GET() {
    await connectDb();

    const users = await User.countDocuments({ role: "customer" });
    const dbUsers = await User.find({ role: "customer"})
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments({status: "Paid"});

    return Response.json({ users, products, orders, dbUsers });
}
