"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setshow] = useState(false);
  const router = useRouter()
  const passRef = useRef()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/")
    }
  }, [])

  const toggleShow = () => {
    setshow(prev => !prev)
  } 

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = { name, email, password };

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      // Clear inputs if success
      if (response.success) {
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          toast.success('Your account has been created!', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          router.push("/login")
        }, 1000);

      }
      else {
        toast.error(response.message || "Signup failed", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);

    }
  };

  return (
    <div className="bg-white max-w-4xl mt-10 mx-auto md:min-h-screen p-4">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="grid md:grid-cols-3 items-center shadow-lg rounded-xl overflow-hidden">
        {/* Left Side Info */}
        <div className="max-md:order-1 flex flex-col justify-center md:space-y-16 space-y-8 max-md:mt-16 min-h-full bg-linear-to-r from-slate-900 to-slate-700 lg:px-8 px-4 py-4">
          <div>
            <h3 className="text-white text-lg">Create Your Account</h3>
            <p className="text-[13px] text-slate-300 mt-3 leading-relaxed">
              Welcome to our registration page! Get started by creating your account.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg">Simple & Secure Registration</h3>
            <p className="text-[13px] text-slate-300 mt-3 leading-relaxed">
              Our registration process is straightforward and secure. We prioritize your privacy.
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 w-full py-6 px-6 sm:px-14 max-w-lg mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-slate-900 text-2xl font-bold">Register Now</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-slate-900 text-sm font-medium mb-2 block">
                Name
              </label>
              <input
                onChange={handleChange}
                value={name}
                name="name"
                type="text"
                required
                className="text-slate-900 bg-white border border-slate-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="text-slate-900 text-sm font-medium mb-2 block">
                Email Id
              </label>
              <input
                onChange={handleChange}
                value={email}
                name="email"
                type="email"
                required
                className="text-slate-900 bg-white border border-slate-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter email"
              />
            </div>

            <div className="relative">
              <label className="text-slate-900 text-sm font-medium mb-2 block">
                Password
              </label>
              <input
                ref={passRef}
                onChange={handleChange}
                value={password}
                name="password"
                type={show ? "text" : "password"}
                required
                minLength={8}
                className="text-slate-900 bg-white border border-slate-300 w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-500"
                placeholder="Enter password"
              />
              <span onClick={toggleShow} className="cursor-pointer"><img src={show ? "/visibility.png" : "/visibility_off.png"} alt="eye" className='absolute top-10 right-4 opacity-30 w-5' /></span>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm text-slate-600"
              >
                I accept the{" "}
                <a
                  href="#"
                  className="text-blue-600 font-medium hover:underline ml-1"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-2.5 px-4 tracking-wider text-sm rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none cursor-pointer"
            >
              Create an account
            </button>
          </div>

          <p className="text-slate-600 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link
              href={"/login"}
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
