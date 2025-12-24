"use client"
import React, { useState, useEffect } from 'react'
import { IoIosAddCircle } from "react-icons/io";
import { AiFillMinusCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, clearCart } from "@/redux/cart/cartSlice";
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Bounce, toast, ToastContainer } from 'react-toastify';


const Checkout = () => {

  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "", pincode: "", city: "", state: "" })
  // const [disabled, setDisabled] = useState(true)
  const [user, setUser] = useState(null)
  const cartItems = useSelector((state) => state.cart.cartItems);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const dispatch = useDispatch();
  const router = useRouter()

  const cartArray = Object.entries(cartItems); // Convert object to array [[itemcode, {...data}], ...]

  useEffect(() => {
    const myuser = localStorage.getItem("myuser");  // or "myuser"
    if (myuser) {
      const parsed = JSON.parse(myuser);
      setUser(parsed);
      fetchData(parsed.token);
    }

  }, []);

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
      getPincode(result.pincode)

    }
  }

  const getPincode = async (pin) => {
    if (!pin || pin.length !== 6) {
      // Reset city/state when pin becomes invalid
      setForm(prev => ({
        ...prev,
        city: "",
        state: "",
      }));
      return;
    }

    try {
      const res = await fetch(`/api/pincode`);
      const pinJson = await res.json();

      if (pinJson[pin]) {
        // Valid pincode → set city/state
        setForm(prev => ({
          ...prev,
          city: pinJson[pin][0],
          state: pinJson[pin][1],
        }));
      } else {
        // Pincode does not exist → clear fields
        setForm(prev => ({
          ...prev,
          city: "",
          state: "",
        }));
      }
    } catch (e) {
      console.error("Pincode API Error:", e);

      // API error → still clear city/state
      setForm(prev => ({
        ...prev,
        city: "",
        state: "",
      }));
    }
  };


  const handleChange = async (e) => {
  const { name, value } = e.target;

  // update the value for the input
  const updated = { ...form, [name]: value };
  setForm(updated);

  // Only run city/state logic when user is typing pincode
  if (name === "pincode") {
    if (value.length === 6) {
      getPincode(value);
    } else {
      // only clear when pincode becomes invalid
      setForm(prev => ({
        ...prev,
        pincode: value,
        city: "",
        state: ""
      }));
    }
  }
};



  const handlePay = async (e) => {
    e.preventDefault();
    try {
      const oid = Math.floor(Math.random() * Date.now());

      const data = {
        cartItems,
        subtotal,
        oid,
        email: user ? user.email : form.email,
        name: form.name,
        address: form.address,
        phone: form.phone,
        pincode: form.pincode,
      };

      const res = await fetch(`/api/razorpay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        if (result.cartClear) {
          dispatch(clearCart())
        }

        toast.error(result.message, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        return;
      }

      const { order } = result;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: form.name,
        description: "Order Payment",
        order_id: order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        handler: async function (response) {
          const verifyRes = await fetch("/api/posttransaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: oid,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            router.push(`/order?oid=${oid}&clearcart=1`);
            dispatch(clearCart())
          } else {
            toast.error("Payment verification failed!", {
              position: "top-left",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            });

          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };


  return (
    <form onSubmit={handlePay} className='container m-auto my-3 min-h-screen' >
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      <h2 className="font-semibold text-xl">1. Delivery Details</h2>
      <div className='mx-auto flex my-2'>
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="name" className="mx-1 leading-7 text-sm text-gray-700">Name</label>
            <input
              onChange={handleChange}
              value={form.name}
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="name" className="mx-1 leading-7 text-sm text-gray-700">Email</label>
            {user ?
              <input
                value={user.email}
                type="email"
                id="email"
                name="email"
                required
                readOnly
                className="w-full bg-gray-100 rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 leading-8" />
              : <input
                onChange={handleChange}
                value={form.email}
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />}

          </div>
        </div>
      </div>
      <div className="px-2 w-full">
        <div className=" mb-4">
          <label htmlFor="address" className="mx-1 leading-7 text-sm text-gray-700">Address</label>
          <textarea
            onChange={handleChange}
            value={form.address}
            name="address"
            id="address"
            required
            cols="30" rows="2"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>
        </div>
      </div>

      <div className='mx-auto flex my-2'>
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="phone" className="mx-1 leading-7 text-sm text-gray-700">Phone</label>
            <input
              onChange={(e) => {
                const value = e.target.value;

                // Allow only numbers
                if (/^\d*$/.test(value)) {
                  handleChange(e);   // Only call handleChange when it's valid
                }
              }}
              value={form.phone}
              type="text"
              id="phone"
              name="phone"
              maxLength={10}
              inputMode="numeric"
              pattern="\d*"
              required
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="pincode" className="mx-1 leading-7 text-sm text-gray-700">Pincode</label>
            <input
              onChange={(e) => {
                const value = e.target.value;

                // Allow only numbers
                if (/^\d*$/.test(value)) {
                  handleChange(e);   // Only call handleChange when it's valid
                }
              }}
              value={form.pincode}
              type="text"
              id="pincode"
              name="pincode"
              maxLength={6}
              inputMode="numeric"
              pattern="\d*"
              required
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <div className='mx-auto flex my-2'>
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="city" className="mx-1 leading-7 text-sm text-gray-700">City</label>
            <input
              onChange={handleChange}
              value={form.city}
              type="text"
              id="city"
              name="city"
              required
              readOnly
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className="px-2 w-1/2">
          <div className=" mb-4">
            <label htmlFor="state" className="mx-1 leading-7 text-sm text-gray-700">State</label>
            <input
              onChange={handleChange}
              value={form.state}
              type="text"
              id="state"
              name="state"
              required
              readOnly
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>

      <h2 className="font-semibold text-xl">2. Review Cart Items & Pay</h2>
      <div className="sideCart my-4 rounded-md  bg-gray-100  px-6 py-4 outline-1 outline-gray-300 text-black" >



        <div className="w-full ">
          <div className="flex justify-between">
            <h2 className="font-semibold " >Shopping Cart</h2>

          </div>

          {/* 🧾 Cart Items */}
          <div className="mt-8">
            {cartArray.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="-my-6 divide-y divide-gray-200 select-none">
                {cartArray.map(([itemcode, item]) => (
                  <li key={itemcode} className="flex py-6">
                    <div className="size-20 shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 justify-between  flex-col">
                      <div className="flex justify-between px-1 text-base font-medium text-gray-900">
                        <div className='flex flex-col gap-1'>
                          <h3>{item.name}</h3>
                          <h4 className='text-[12px] font-normal'>{item.desc}</h4>
                        </div>
                        <p>₹{item.price}</p>
                      </div>
                      <div className="flex items-center justify-end gap-1 my-2">
                        <button
                          onClick={() => dispatch(removeFromCart({ itemcode: itemcode }))}
                          className="text-lg text-gray-800 hover:text-gray-500"
                        >
                          <AiFillMinusCircle />
                        </button>
                        <p className="text-[12px]">{item.qty}</p>
                        <button
                          onClick={() => dispatch(addToCart({ itemcode, name: item.name, price: item.price, qty: 1, }))}
                          className="text-lg text-gray-800 hover:text-gray-500"
                        >
                          <IoIosAddCircle />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>


        {/* 🧾 Cart Footer */}
        <div className=" px-2 py-6">
          <hr className='text-gray-300 mb-2' />
          <div className="flex justify-between text-base font-bold text-gray-900 select-none">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>


          <button
            type='submit'
            className="flex gap-1 w-1/7 items-center justify-center rounded-md bg-gray-600 px-3 py-4 text-base font-medium text-white hover:bg-gray-700 cursor-pointer"
          >

            Pay ₹{subtotal}
          </button>
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />

        </div>



      </div>

    </form >

  )


}


export default Checkout

{/* <CheckoutButton amount={subtotal} /> */ }