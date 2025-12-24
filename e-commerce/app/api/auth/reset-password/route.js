import connectDb from "@/db/connectDb";
import User from "@/models/User";
import CryptoJS from "crypto-js";

export async function POST(req) {
    try {
        await connectDb();

        const { contact, password } = await req.json();

        if (!contact || !password) {
            return Response.json(
                { success: false, message: "Missing contact or password" },
                { status: 400 }
            );
        }

        // Detect email or phone
        const isEmail = contact.includes("@");

        const query = isEmail ? { email: contact } : { phone: contact };

        const user = await User.findOne(query);

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Encrypt using CryptoJS + real key
        const encryptedPassword = CryptoJS.AES.encrypt(
            password,
            process.env.AES_SECRET
        ).toString();

        await User.findOneAndUpdate(query, { password: encryptedPassword });

        return Response.json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (err) {
        console.error("Reset Password Error:", err);
        return Response.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }
}
