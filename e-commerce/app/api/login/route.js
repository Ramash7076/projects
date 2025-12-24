import User from "@/models/User";
import connectDb from "@/db/connectDb";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDb();
  const body = await req.json();

  const user = await User.findOne({ email: body.email });
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" });
  }

  const decryptedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.AES_SECRET
  ).toString(CryptoJS.enc.Utf8);

  if (body.password !== decryptedPassword) {
    return NextResponse.json({ success: false, error: "Invalid credentials" });
  }

  // Create token
  const token = jwt.sign(
    {
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({
    success: true,
    email: user.email,
    role: user.role,
    token, // customer token (frontend use)
  });

  // Only set cookie if user is admin
  if (user.role === "admin") {
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return res;
}
