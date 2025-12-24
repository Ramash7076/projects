"use client";
import { useEffect, useState } from "react";
import {
    AreaChart, Area,
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {

    const [counts, setCounts] = useState({ users: 0, products: 0, orders: 0 });

    useEffect(() => {
        const fetchCounts = async () => {
            const res = await fetch("/api/getuser");
            const data = await res.json();
            setCounts(data);
        };
        fetchCounts();
    }, []);

    // Dummy chart data (replace later with real data)
    const salesData = [
        { month: "Jan", sales: 400 },
        { month: "Feb", sales: 550 },
        { month: "Mar", sales: 700 },
        { month: "Apr", sales: 620 },
        { month: "May", sales: 900 },
        { month: "June", sales: 1100 },
    ];

    const userGrowth = [
        { month: "Jan", users: 10 },
        { month: "Feb", users: 25 },
        { month: "Mar", users: 40 },
        { month: "Apr", users: 55 },
        { month: "May", users: 70 },
        { month: "June", users: 90 },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded shadow text-black text-center">
                    <p className="text-lg font-semibold">Users</p>
                    <p className="text-2xl font-bold">{counts.users}</p>
                </div>
                <div className="p-4 bg-white rounded shadow text-black text-center">
                    <p className="text-lg font-semibold">Products</p>
                    <p className="text-2xl font-bold">{counts.products}</p>
                </div>
                <div className="p-4 bg-white rounded shadow text-black text-center">
                    <p className="text-lg font-semibold">Orders</p>
                    <p className="text-2xl font-bold">{counts.orders}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-2 gap-6">

                {/* Sales Chart */}
                <div className="p-4 bg-white rounded shadow text-black">
                    <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#3b82f6"
                                    fill="url(#salesColor)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="p-4 bg-white rounded shadow text-black">
                    <h2 className="text-lg font-semibold mb-4">User Growth</h2>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowth}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
