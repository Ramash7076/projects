"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      const stored = localStorage.getItem("myuser");

      if (!stored) {
        console.log("No myuser found");
        return;
      }
      const myuser = JSON.parse(stored);

      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: myuser.token}),
      });

      const res = await response.json();

      if (res.success) {
        setOrders(res.orders);
      }
    };

    fetchOrder();
  }, []);


  return (
    <div>
      <section className="bg-white py-8 min-h-screen md:py-16">
        <div className="mx-auto max-w-7xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl">My orders</h2>



            </div>

            <div className="mt-6 flow-root sm:mt-8">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((item, index) => {
                  return <div key={index} className="flex flex-wrap items-center gap-y-4 py-6 px-4 mb-2 rounded-md hover:bg-gray-100">
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Order ID:</dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 ">
                        <a href="#" className="hover:underline">#{item.OrderId}</a>
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Date:</dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 ">20.12.2023</dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Price:</dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 ">${item.amount}</dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
                      <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                        </svg>
                        {item.status}
                      </dd>
                    </dl>

                    <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                      <button type="button" className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto">Cancel order</button>
                      <Link href={`${process.env.NEXT_PUBLIC_HOST}/order?oid=${item.OrderId}`} className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto">View details</Link>
                    </div>
                  </div>
                })}

              </div>
            </div>


          </div>
        </div>
      </section>
    </div>
  )
}

export default Orders
