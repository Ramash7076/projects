"use client";
import React, { useEffect, useState } from "react";

// MongoDB Atlas‑like styling inspiration
// Dark theme, green accents, table hover, clean spacing

export default function Users() {
    const [dbUsers, setDbUsers] = useState([]);

    useEffect(() => {
        const fetchCounts = async () => {
            const res = await fetch("/api/getuser");
            const data = await res.json();
            setDbUsers(data.dbUsers);
        };
        fetchCounts();
    }, []);

    return (<>
        <div className="min-h-screen  text-white p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Users</h1>

            <div className="space-y-3">
                {dbUsers.map((u) => (
                    <div
                        key={u._id}
                        className="border border-gray-300 rounded-lg p-5 shadow-md text-sm font-mono text-gray-800"
                    >
                        <pre className="whitespace-pre-wrap leading-6">
                            <div><span className="font-bold text-gray-600">name :</span> <span className=" text-green-700">{u.name}</span></div>
                            <div><span className="font-bold text-gray-600">email :</span> <span className=" text-green-700">{u.email}</span></div>
                            {/* <div>password: "{u.password}"</div> */}
                            <div><span className="font-bold text-gray-600">address :</span> <span className=" text-green-700">"{u?.address || ""}"</span></div>
                            <div><span className="font-bold text-gray-600">pincode :</span> <span className=" text-green-700">{u?.pincode || ""}</span></div>
                            <div><span className="font-bold text-gray-600">phone :</span> <span className=" text-green-700">{u?.phone || ""}</span></div>
                            <div><span className="font-bold text-gray-600">createdAt :</span> <span className="text-blue-700">{new Date(u.createdAt).toISOString()}</span> </div>
                            <div><span className="font-bold text-gray-600">updatedAt :</span> <span className="text-blue-700">{new Date(u.updatedAt).toISOString()}</span> </div>
                        </pre>
                    </div>
                ))}
            </div>
        </div>
        
    </>
    );
}
