"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, buyNow } from "@/redux/cart/cartSlice";
import { openSideCart } from "@/redux/sidecart/uiSlice";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Image from "next/image";

export default function ProductClient({ product, slug }) {
  const dispatch = useDispatch();
  const [pin, setPin] = useState("");
  const [service, setService] = useState(null);

  const checkServiceAbility = async () => {
    const res = await fetch("/api/pincode");
    const data = await res.json();

    if (data[pin]) {
      setService(true);
      toast.success("Your Pincode is Serviceable");
    } else {
      setService(false);
      toast.error("Pincode Not Serviceable");
    }
  };

  return (
    <div className="container px-5 py-16 mx-auto min-h-screen">
      <ToastContainer transition={Bounce} />

      <div className="lg:w-4/5 mx-auto flex flex-wrap p-10 gap-4 justify-center">
        <Image
          src={product.image}
          alt="product"
          height={300}
          width={300}
          unoptimized
          className="shadow-md rounded-lg object-cover "
        />

        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 ">
          <h2 className="text-sm text-gray-500 mb-3">{product.category}</h2>
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <p className="leading-relaxed text-gray-500 mt-1 mb-8">{product.desc}</p>

          <div className="flex mt-4">
            {product.availableQty <= 0 ? (
              <span className="text-xl text-red-600">Out of stock!</span>
            ) : (
              <span className="text-2xl">₹{product.price}</span>
            )}

            <Link href="/checkout" className="ml-6">
              <button
                disabled={product.availableQty <= 0}
                onClick={() =>
                  dispatch(buyNow({ itemcode: slug, ...product, qty: 1 }))
                }
                className="px-6 py-2 disabled:bg-gray-400 hover:bg-gray-500 bg-gray-600 text-white rounded cursor-pointer"
              >
                Buy Now
              </button>
            </Link>

            <button
              disabled={product.availableQty <= 0}
              onClick={() => {
                dispatch(addToCart({ itemcode: slug, ...product, qty: 1 }))
                dispatch(openSideCart())
              }}
              className="ml-4 px-6 py-2 disabled:bg-gray-400 bg-gray-600 hover:bg-gray-500 text-white rounded cursor-pointer"
            >
              Add to Cart
            </button>
          </div>

          <div className="flex gap-1 mt-3">
            <input
              value={pin}
              onChange={(e) => /^\d*$/.test(e.target.value) && setPin(e.target.value)}
              maxLength={6}
              placeholder="Enter Pincode"
              className="border-2 border-gray-300 rounded-md px-3"
            />
            <button
              onClick={checkServiceAbility}
              className="ml-5 px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
            >
              Check
            </button>
          </div>

          {service !== null && (
            <div className="mt-2 text-sm">
              {service ? (
                <div className="text-green-700">This Pincode is serviceable</div>
              ) : (
                <div className="text-red-700">This Pincode is not serviceable</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}
