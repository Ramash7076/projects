"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const searchParams = useSearchParams();
  const oid = searchParams.get("oid");

  const [order, setOrder] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!oid) return;

    const fetchOrder = async () => {
      const res = await fetch("/api/order", {
        method: "POST",
        body: JSON.stringify({ oid }),
      });

      const data = await res.json();

      if (data.success) {
        setOrder(data.order);

        const d = new Date(data.order.updatedAt);
        setDate(d);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [oid]);

  if (!oid) {
    return <h1 className="text-center p-10 text-xl">❌ No Order ID Provided</h1>;
  }

  if (loading) {
    return <h1 className="text-center p-10 text-xl">Loading...</h1>;
  }

  if (!order) {
    return <h1 className="text-center p-10 text-xl">❌ Order Not Found</h1>;
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden min-h-screen">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">

          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              ramash.site
            </h2>

            <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
              Order Id: #{order.OrderId}
            </h1>

            <p className="leading-relaxed mb-4">
              Your order has been{" "}
              <b>{order.status === "Paid" ? "successfully Placed" : "created"}.</b>
            </p> 

            <p className="leading-relaxed mb-4">
              Order placed on:{" "}
              <b>
                {date &&
                  date.toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </b>
            </p>

            <div className="flex mb-4">
              <a className="grow w-1/3 text-start border-b-2 border-gray-300 py-2 text-lg px-1">Item</a>
              <a className="grow w-1/3 text-center border-b-2 border-gray-300 py-2 text-lg px-1">Qty</a>
              <a className="grow w-1/3 text-end border-b-2 border-gray-300 py-2 text-lg px-1">Total</a>
            </div>

            {Object.values(order.products).map((item, index) => (
              <div key={index} className="flex py-2">
                <span className="w-1/3 text-start text-gray-900 break-all">{item.name}</span>
                <span className="w-1/3 text-center text-gray-900">{item.qty}</span>
                <span className="w-1/3 text-end text-gray-900">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}

            <div className="flex flex-col mt-4">
              <span className="title-font font-medium text-2xl text-gray-900">
                Subtotal: ₹{order.amount}
              </span>

              <div className="my-6">
                <button className="flex text-white bg-gray-500 border-0 py-2 px-6 rounded">
                  Track Order
                </button>
              </div>
            </div>
          </div>

          <Image
            src={Object.values(order.products)[0].image}
            alt="order image"
            unoptimized
            height={100}
            width={400}
            className="object-cover mx-auto rounded shadow-xl border border-gray-200"
          />
        </div>
      </div>
    </section>
  );
}
