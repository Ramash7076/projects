"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function Forgot() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [contact, setContact] = useState("");
  const router = useRouter()


  const sendOtp = async () => {
    if (!contact) {
      toast.error("Please enter email or phone");
      return;
    }

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact }), // send only one field
    });

    const data = await res.json();

    if (data.success) {
      setOtpSent(true);
    } else {
      toast.error(data.message);
    }
  };


  const verifyOtp = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, otp }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/reset-password?contact=${contact}`);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="max-w-md mx-auto mt-20 p-10 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>

        {!otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter email or phone number"
              className="w-full p-2 border rounded mb-3"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white p-2 rounded cursor-pointer"
            >
              Send OTP
            </button>
          </>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white p-2 rounded cursor-pointer"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
