"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openSideCart, closeSideCart } from '@/redux/sidecart/uiSlice'
import Link from 'next/link'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const MyAccount = () => {
    const [form, setForm] = useState({ name: "", email: "", address: "", phone: "", pincode: "", password: "", npassword: "", cpassword: "" })
    const [user, setUser] = useState(null)
    const [show, setShow] = useState({ password: false, npassword: false, cpassword: false });
    const isOpen = useSelector((state) => state.sidecart.isSideCartOpen)
    const dispatch = useDispatch();
    const passRef = useRef()

    useEffect(() => {
        const myuser = localStorage.getItem("myuser");  // or "myuser"
        if (myuser) {
            const parsed = JSON.parse(myuser);
            setUser(parsed);
            fetchData(parsed.token);
        }
    }, []);

    const toggleShow = (field) => {
        setShow(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };


    const fetchData = async (token) => {
        const data = { token: token };

        const res = await fetch(`/api/getuser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        // // Autofill user fields
        if (result.success) {
            setUser(prev => ({
                ...prev,
                name: result.name,
                email: result.email,
                address: result.address,
                phone: result.phone,
                pincode: result.pincode
            }));
            setForm(prev => ({
                ...prev,
                name: result.name || "",
                address: result.address || "",
                phone: result.phone || "",
                pincode: result.pincode || ""
            }));

        }
    }

    const handleChange = async (e) => {
        const { name, value } = e.target;

        // 👉 Stop user from typing more than 6 digits in pincode
        // if (name === "pincode" && value.length > 6) return;
        // if (name === "phone" && value.length > 10) return;

        // Update typed value
        const updated = { ...form, [name]: value };
        setForm(updated);


    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();

        const data = { token: user.token, name: form.name, address: form.address, phone: form.phone, pincode: form.pincode };

        const res = await fetch(`/api/updateuser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (result.success) {
            setTimeout(() => {
                toast.success('Profile Updated Successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                dispatch(closeSideCart())
            }, 1000);
        }


    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (form.npassword !== form.cpassword) {
            toast.error("Confirm passwords do not match!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }
        if (form.password === form.npassword) {
            toast.error("Old password and new password must be different", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        if (form.npassword == form.cpassword && form.password != form.npassword) {
            const data = { token: user.token, password: form.password, npassword: form.npassword, cpassword: form.cpassword };

            const res = await fetch(`/api/updatepassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) {

                toast.success('Profile Updated Successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }
            else {
                toast.error(result.error || "Something went wrong", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        }
        setForm({ ...form, password: "", npassword: "", cpassword: "" })
    };


    return (<>
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8 min-h-screen">
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Bounce}
            />
            {/* navbar of MyAccount page */}
            <nav className="mb-4 flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <Link href={"/"} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <svg className="me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                            </svg>
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="mx-1 h-4 w-4 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                            </svg>
                            <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white md:ms-2">My account</a>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="mx-1 h-4 w-4 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                            </svg>
                            <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ms-2">Account</span>
                        </div>
                    </li>
                </ol>
            </nav>
            <h2 className="mb-4 text-xl px-8 font-semibold border-b border-gray-200 py-4 dark:border-gray-700 text-gray-900 dark:text-white sm:text-2xl md:mb-6">General overview</h2>

            {/* general overview */}
            <div className="py-4 md:py-8 mx-auto w-[90vw]">
                <div className="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <img className="h-16 w-16 rounded-lg" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" alt="Helene avatar" />
                            <div>
                                <span className="mb-2 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"> PRO Account </span>
                                <h2 className="flex items-center text-xl font-bold leading-none text-gray-900 dark:text-white sm:text-2xl">{user?.name || "User"}</h2>
                            </div>
                        </div>
                        <dl className="">
                            <dt className="font-semibold text-gray-900 dark:text-white">Email Address</dt>
                            <dd className="text-gray-500 dark:text-gray-400">{user?.email}</dd>
                        </dl>
                        <dl>
                            <dt className="font-semibold text-gray-900 dark:text-white">Home Address</dt>
                            <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <svg className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                                </svg>
                                2 Miles Drive, NJ 071, New York, United States of America
                            </dd>
                        </dl>
                        <dl>
                            <dt className="font-semibold text-gray-900 dark:text-white">Delivery Address</dt>
                            <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <svg className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                                </svg>
                                {user?.address}, {user?.pincode}
                            </dd>
                        </dl>
                    </div>
                    <div className="space-y-4">
                        <dl>
                            <dt className="font-semibold text-gray-900 dark:text-white">Phone Number</dt>
                            <dd className="text-gray-500 dark:text-gray-400">{user?.phone}</dd>
                        </dl>
                        <dl>
                            <dt className="font-semibold text-gray-900 dark:text-white">Favorite pick-up point</dt>
                            <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <svg className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"
                                    />
                                </svg>
                                Herald Square, 2, New York, United States of America
                            </dd>
                        </dl>
                        <dl>
                            <dt className="font-semibold text-gray-900 dark:text-white">My Companies</dt>
                            <dd className="text-gray-500 dark:text-gray-400">FLOWBITE LLC, Fiscal code: 18673557</dd>
                        </dl>
                        <dl>
                            <dt className="mb-1 font-semibold text-gray-900 dark:text-white">Payment Methods</dt>
                            <dd className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                    <img className="h-4 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="" />
                                    <img className="hidden h-4 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg" alt="" />
                                </div>
                                <div>
                                    <div className="text-sm">
                                        <p className="mb-0.5 font-medium text-gray-900 dark:text-white">Visa ending in 7658</p>
                                        <p className="font-normal text-gray-500 dark:text-gray-400">Expiry 10/2024</p>
                                    </div>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
                <button onClick={() => { dispatch(openSideCart()) }} type="button" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto cursor-pointer">
                    <svg className="-ms-0.5 me-1.5 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"></path>
                    </svg>
                    Edit your data
                </button>
            </div>

            <h2 className="mb-4 text-xl px-8 font-semibold border-b border-gray-200 py-4 dark:border-gray-700 text-gray-900 dark:text-white sm:text-2xl md:mb-6">Update Password</h2>

            {/* Change Password */}
            <form onSubmit={handlePasswordSubmit} className="py-4 md:py-5 mx-auto w-[90vw]">
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3 ">
                    <div className="col-span-2 sm:col-span-1 relative">
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Old Password </label>
                        <input
                            ref={passRef}
                            onChange={handleChange}
                            type={show.password ? "text" : "password"}
                            name='password'
                            value={form.password}
                            id="password"
                            placeholder="Enter old password"
                            required
                            minLength={8}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        />
                        <span onClick={() => { toggleShow("password") }} className='cursor-pointer'><img src={show.password ? "/visibility.png" : "/visibility_off.png"} alt="eye" className='absolute top-10 right-4 invert w-5' /></span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 relative">
                        <label htmlFor="npassword" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> New Password </label>
                        <input
                            ref={passRef}
                            onChange={handleChange}
                            type={show.npassword ? "text" : "password"}
                            name='npassword'
                            value={form.npassword}
                            placeholder="Enter new password"
                            required
                            minLength={8}
                            id="npassword"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        />
                        <span onClick={() => { toggleShow("npassword") }} className='cursor-pointer'><img src={show.npassword ? "/visibility.png" : "/visibility_off.png"} alt="eye" className='absolute top-10 right-4 invert w-5' /></span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 relative">
                        <label htmlFor="cpassword" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Confirm New Password </label>
                        <input
                            ref={passRef}
                            onChange={handleChange}
                            type={show.cpassword ? "text" : "password"}
                            name='cpassword'
                            value={form.cpassword}
                            id="cpassword"
                            placeholder="Confirm new password"
                            required
                            minLength={8}
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        />
                        <span onClick={() => { toggleShow("cpassword") }} className='cursor-pointer'><img src={show.cpassword ? "/visibility.png" : "/visibility_off.png"} alt="eye" className='absolute top-10 right-4 invert w-5' /></span>
                    </div>
                </div>
                <button type="submit" className="me-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">Change Password</button>
            </form>

        </section >
        {/* account details */}
        <div className={`max-h-auto fixed left-0 right-0 top-0 z-50 ${isOpen ? "block" : "hidden"} h-[calc(100%-1rem)] max-h-full backdrop-blur-sm w-full items-center justify-center overflow-y-auto overflow-x-hidden antialiased md:inset-0`}>
            <div className="max-h-auto mx-auto relative max-h-full w-full max-w-lg p-4">

                <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">

                    <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 dark:border-gray-700 md:p-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
                        <button onClick={() => { dispatch(closeSideCart()) }} type="button" className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                            <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <form onSubmit={handleUserSubmit} className="p-4 md:p-5">
                        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">


                            <div className="col-span-2 ">
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your Full Name* </label>
                                <input onChange={handleChange} type="text" name='name' value={form.name} id="name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Enter your full name" required />
                            </div>

                            <div className="col-span-2 ">
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your Email* </label>
                                <input onChange={handleChange} type="text" name='email' value={user?.email || ""} id="email" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Enter your email here" required readOnly={user ? true : false} />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number* </label>
                                <input onChange={handleChange} type="text" name='phone' value={form.phone} id="phone" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Enter your phone number" required />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label htmlFor="pincode" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Pincode* </label>
                                <input onChange={handleChange} type="text" name='pincode' value={form.pincode} id="pincode" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Enter your pincode" required />
                            </div>

                            <div className="col-span-2 ">
                                <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Delivery Address* </label>
                                <textarea onChange={handleChange} id="address" name='address' value={form.address} rows="4" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Enter here your address" required></textarea>
                            </div>

                        </div>





                        <div className="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
                            <button type="submit" className="me-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">Save information</button>
                            <button onClick={() => { dispatch(closeSideCart()) }} type="button" data-modal-toggle="accountInformationModal2" className="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-gray-700 cursor-pointer">Cancel</button>
                        </div>
                    </form>

                </div>
            </div>
        </div >
    </>
    )
}

export default MyAccount
