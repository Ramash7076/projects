"use client";

import { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ResetPasswordClient({ contact }) {

    const [password, setPassword] = useState({ npassword: "", cpassword: "" });
    const [show, setShow] = useState({ npassword: false, cpassword: false });

    const router = useRouter();

    const handleChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const toggleShow = (field) => {
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const resetPass = async () => {
        if (password.npassword.length < 8) {
            toast.error("Minimum 8 characters required");
            return;
        }

        if (password.npassword !== password.cpassword) {
            toast.error("Passwords do not match");
            return;
        }

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contact,                        // ✔ using contact instead of token
                password: password.npassword,
            }),
        });

        const data = await res.json();

        if (data.success) {
            toast.success(data.message || "Password updated");
            setTimeout(() => router.push("/login"), 1000);
        } else {
            toast.error(data.message || "Failed");
        }
    };

    return (
        <div className="min-h-screen">
            <ToastContainer theme="dark" transition={Bounce} />

            <div className="max-w-md mx-auto mt-20 p-10 rounded shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Reset Password</h1>

                <div className="relative flex flex-col gap-4">

                    {/* New password */}
                    <div className="relative">
                        <input
                            name="npassword"
                            type={show.npassword ? "text" : "password"}
                            placeholder="New Password"
                            className="w-full p-2 border rounded"
                            value={password.npassword}
                            onChange={handleChange}
                        />
                        <span
                            onClick={() => toggleShow("npassword")}
                            className="cursor-pointer absolute top-3 right-4"
                        >
                            <img
                                src={show.npassword ? "/visibility.png" : "/visibility_off.png"}
                                className="opacity-50 w-5"
                            />
                        </span>
                    </div>

                    {/* Confirm password */}
                    <div className="relative">
                        <input
                            name="cpassword"
                            type={show.cpassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full p-2 border rounded"
                            value={password.cpassword}
                            onChange={handleChange}
                        />
                        <span
                            onClick={() => toggleShow("cpassword")}
                            className="cursor-pointer absolute top-3 right-4"
                        >
                            <img
                                src={show.cpassword ? "/visibility.png" : "/visibility_off.png"}
                                className="opacity-50 w-5"
                            />
                        </span>
                    </div>

                </div>

                <button
                    onClick={resetPass}
                    className="w-full bg-blue-600 text-white p-2 rounded mt-6 cursor-pointer"
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
}
