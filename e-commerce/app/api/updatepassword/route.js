import User from "@/models/User";
import connectDb from "@/db/connectDb";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";



export async function POST(req) {

    await connectDb()

    try { 
        const body = await req.json()

        if (!body.token) {
            return Response.json({ success: false, error: "Missing token" }, { status: 400 });
        }

        const user = jwt.verify(body.token, process.env.JWT_SECRET);
        const dbuser = await User.findOne({ email: user.email });

        if (!dbuser) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }
        // const bytes  = 
        let decryptedPass = CryptoJS.AES.decrypt(dbuser.password, 'process.env.AES_SECRET').toString(CryptoJS.enc.Utf8);

        if (user) {
            if (decryptedPass == body.password && body.npassword == body.cpassword) {
                await User.findOneAndUpdate({ email: dbuser.email }, { password: CryptoJS.AES.encrypt(body.cpassword, 'process.env.AES_SECRET').toString() });
                return Response.json({ success: true })
            }
            else {

                return Response.json({ success: false, error: "Incorrect old password" })
            }
        }
        else {
            return Response.json({ success: false, error: "User not found" })

        }
    } catch (error) {
        console.error("Update Error:", error);
        return Response.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }

}