import connectDb from "@/db/connectDb";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    await connectDb();

    const { contact, otp } = await req.json();

    if (!contact || !otp) {
      return Response.json({
        success: false,
        message: "Contact & OTP required",
      });
    }

    const record = await Otp.findOne({ contact }).sort({ createdAt: -1 });

    if (!record) {
      return Response.json({
        success: false,
        message: "OTP not found",
      });
    }

    if (record.expireAt < Date.now()) {
      return Response.json({
        success: false,
        message: "OTP expired",
      });
    }

    if (String(record.otp) !== String(otp)) {
      return Response.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await Otp.deleteMany({ contact });

    return Response.json({
      success: true,
      message: "OTP verified",
    });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}
