"use client"
import React, { useEffect, useState } from 'react'

const Orders = () => {
    const [orders, setOrders] = useState([])
    useEffect(() => {
        const fetchCounts = async () => {
            const res = await fetch("/api/getorders");
            const data = await res.json();
            setOrders(data.orders);
        };
        fetchCounts();
    }, []);
    return (
        <div className="min-h-screen  text-white p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>

            <div className="space-y-3">
                {orders.map((u) => (
                    <div
                        key={u._id}
                        className="border border-gray-300 rounded-lg p-5 shadow-md text-sm font-mono text-gray-800"
                    >
                        <pre className="whitespace-pre-wrap leading-6">
                            <div>
                                <span className="font-bold text-gray-600">OrderID : </span>
                                <span className=" text-green-700">"{u.OrderId}"</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">Address : </span>
                                <span className=" text-green-700">"{u.address}"</span>
                            </div>

                            <div>
                                <span className="font-bold text-gray-600">Amount : </span>
                                <span className="text-blue-700">{u.amount}</span>
                            </div>

                            <div>
                                <span className="font-bold text-gray-600">Email : </span>
                                <span className=" text-green-700">"{u.email}"</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">Name : </span>
                                <span className=" text-green-700">"{u.name}"</span>
                            </div>
                            <div className="w-4/5 flex items-start">
                                <span className="font-bold text-gray-600">PaymentInfo : </span>
                                <span className="text-green-700 ml-1 truncate block max-w-[280px]">"{u.paymentInfo}</span>
                                <span className="text-green-700">"</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">Transaction ID : </span>
                                <span className=" text-green-700">"{u.transactionId}"</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">Phone : </span>
                                <span className="text-blue-700">{u.phone}</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">Pincode : </span>
                                <span className="text-blue-700">{u.pincode}</span>
                            </div>
                            
                            {/* PRODUCTS SECTION */}
                            <div>
                                <h3 className="font-bold text-gray-600 mb-2">Products:</h3>
                                <div className="pt-2 ml-10 flex gap-4 flex-wrap">

                                    {Object.entries(u.products).map(([key, p]) => (
                                        <div
                                            key={key}
                                            className="border w-64 border-gray-200 rounded-lg p-3 mb-3 bg-gray-50"
                                        >
                                            <div className="font-semibold text-gray-700">
                                                {p.name} (x{p.qty})
                                            </div>

                                            <div className="text-gray-600">₹ {p.price}</div>

                                            <div className="text-gray-500 text-sm mt-1 line-clamp-2">
                                                {p.desc}
                                            </div>

                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-20 h-20 object-cover rounded mt-2 border"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">Status : </span>
                                <span className=" text-green-700">"{u.status}"</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">createdAt : </span>
                                <span className="text-blue-700">{new Date(u.createdAt).toISOString()}</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-600">updatedAt : </span>
                                <span className="text-blue-700">{new Date(u.updatedAt).toISOString()}</span>
                            </div>
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders
