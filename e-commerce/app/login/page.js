"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useDispatch } from "react-redux";
import { setUser } from '@/redux/cart/cartSlice';

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setshow] = useState(false);
  const dispatch = useDispatch();
  const passRef = useRef()

  useEffect(() => {
    if (localStorage.getItem("myuser")) {
      router.push("/")
    }
  }, [])

  useEffect(() => {
    const user = localStorage.getItem("myuser");
    if (user) {
      const parsed = JSON.parse(user);

      if (parsed.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, []);


  const toggleShow = () => {
    setshow(prev => !prev)
  }

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = { email, password };

      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // credentials: "include",
      });

      const response = await res.json();
      
      // Clear inputs if success
      if (response.success) {
        setEmail("");
        setPassword("");

        localStorage.setItem("myuser", JSON.stringify({ token: response.token, email: response.email, role: response.role }))

        toast.success('You are successfully logged in!', {
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

        setTimeout(() => {
          dispatch(setUser({ token: response.token, email: response.email, role: response.role }));

          // redirect based on role
          if (response.role == "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }, 2300);

      }
      else {
        setPassword("")
        toast.error(response.error, {
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
    <div className='min-h-screen'>
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
      <div className="grid lg:grid-cols-5 md:grid-cols-2 items-center gap-y-4 h-full">
        <div className=" lg:col-span-3 md:min-h-[80vh] flex justify-center items-center bg-[#000842]  md:rounded-xl lg:p-12 m-8">
          <img src="https://readymadeui.com/signin-image.webp" className="lg:w-1/2 w-full h-full object-contain block mx-auto" alt="login-image" />
        </div>

        <div className="lg:col-span-2 w-full py-8 pr-8 max-w-lg max-md:max-w-lg mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h1 className="text-slate-900 text-3xl font-bold">Sign in</h1>
              <p className="text-[15px] mt-6 text-slate-600">Don't have an account <Link href={"/signup"} className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap">Register here</Link></p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-slate-900 text-[15px] font-medium mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input
                    onChange={handleChange}
                    value={email}
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    required
                    className="w-full text-sm text-slate-900 bg-slate-100 focus:bg-transparent pl-4 pr-10 py-3.5 rounded-md border border-gray-200 focus:border-blue-600 outline-none"
                  />

                </div>
              </div>
              <div>
                <label className="text-slate-900 text-[15px] font-medium mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input
                    ref={passRef}
                    onChange={handleChange}
                    value={password}
                    name="password"
                    type={show ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Enter password"
                    className="w-full text-sm text-slate-900 bg-slate-100 focus:bg-transparent pl-4 pr-10 py-3.5 rounded-md border border-gray-200 focus:border-blue-600 outline-none"
                  />
                  <span onClick={toggleShow} className='cursor-pointer'><img src={show ? "/visibility.png" : "/visibility_off.png"} alt="eye" className='absolute top-4 right-4 opacity-30 w-5' /></span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-md" />
                  <label htmlFor="remember-me" className="ml-3 block text-[15px] text-slate-900">
                    Remember me
                  </label>
                </div> */}
                <div>
                  <Link href={"/forgot"} className="text-blue-600 font-medium text-sm hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button type="submit" className="w-full py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
                Sign in
              </button>
            </div>

            <div className="my-4 flex items-center gap-4">
              <hr className="w-full border-slate-300" />
              <p className="text-sm text-slate-900 text-center">or</p>
              <hr className="w-full border-slate-300" />
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-4 py-2.5 px-6 text-[15px] font-medium tracking-wide text-slate-900 border border-slate-300 rounded-md bg-slate-50 hover:bg-slate-100 focus:outline-none cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="inline" viewBox="0 0 512 512">
                <path fill="#fbbd00"
                  d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                  data-original="#fbbd00" />
                <path fill="#0f9d58"
                  d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                  data-original="#0f9d58" />
                <path fill="#31aa52"
                  d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                  data-original="#31aa52" />
                <path fill="#3c79e6"
                  d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                  data-original="#3c79e6" />
                <path fill="#cf2d48"
                  d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                  data-original="#cf2d48" />
                <path fill="#eb4132"
                  d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                  data-original="#eb4132" />
              </svg>
              Continue with google
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
