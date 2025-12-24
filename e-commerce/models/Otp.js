import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  contact: { type: String, required: true }, // email OR phone
  otp: { type: String, required: true },
  expireAt: {
    type: Date,
    default: () => Date.now() + 5 * 60 * 1000, // 5 minutes
  },
}, { timestamps: true });

OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
