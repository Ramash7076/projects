import connectDb from "@/db/connectDb";
import Otp from "@/models/Otp";
import User from "@/models/User";
import nodemailer from "nodemailer";
import twilio from "twilio";

export async function POST(req) {
  try {
    const { contact } = await req.json();
    await connectDb();

    if (!contact) {
      return Response.json({
        success: false,
        message: "Enter email or phone number",
      });
    }

    // Detect email or phone
    const isEmail = contact.includes("@");
    const isPhone = /^[0-9]{10,15}$/.test(contact);

    if (!isEmail && !isPhone) {
      return Response.json({
        success: false,
        message: "Invalid email or phone number",
      });
    }

    // Check user
    const user = await User.findOne(
      isEmail ? { email: contact } : { phone: contact }
    );

    if (!user) {
      return Response.json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP
    await Otp.create({
      contact,
      otp,
      expireAt: Date.now() + 5 * 60 * 1000,
    });

    // ====================== SEND EMAIL ======================
    if (isEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.GMAIL,
        to: contact,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. Valid for 5 minutes.`,
      });

      return Response.json({
        success: true,
        message: "OTP sent to email",
      });
    }

    // ====================== SEND SMS ======================
    if (isPhone) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contact,
        body: `Your OTP is ${otp}. Valid for 5 minutes.`,
      });

      return Response.json({
        success: true,
        message: "OTP sent to SMS",
      });
    }

  } catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      message: "Server Error",
    });
  }
}
