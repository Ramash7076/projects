import User from "@/models/User";
import connectDb from "@/db/connectDb";
import jwt from "jsonwebtoken";

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
        const dbuser = await User.findOneAndUpdate({ email: user.email }, { name: body.name, phone: body.phone, address: body.address, pincode: body.pincode });


        if (!dbuser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }


        return Response.json({
            success: true,
            name: body.name, phone: body.phone, address: body.address, pincode: body.pincode
        });

    } catch (err) {
        return Response.json({ success: false, error: err.message }, { status: 500 });
    }
}
