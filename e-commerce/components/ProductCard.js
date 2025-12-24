"use client"
import { useState } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

export function ProductCard({ product, onDelete, onEdit }) {
    const [hover, setHover] = useState(false);
    const [hoveredtbtn, setHoveredtbtn] = useState(false);
    const [hoverdltbtn, setHoverdltbtn] = useState(false);

    const handleDelete = async () => {
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        await fetch("/api/addproducts", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: product._id }),
        });

        // 🔥 instant UI update
        onDelete(product._id);
    };

    const handleUpdate = () => {
        onEdit(product);
    };


    return (
        <div
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="relative border border-gray-300 rounded-lg p-5 shadow-md text-sm font-mono text-gray-800 bg-white transition hover:shadow-lg"
        >
            {/* Hover buttons */}
            {hover && (
                <div className="absolute right-5 top-4 flex gap-2 z-10">
                    <button
                        onClick={handleUpdate}
                        onMouseOver={() => setHoveredtbtn(true)}
                        onMouseLeave={() => setHoveredtbtn(false)}
                        className=" p-2 rounded-md border transition text-gray-950 px-2 py-0.5 flex items-center justify-center gap-1 border-gray-400 hover:ring-3 hover:ring-[#efeded]  duration-200 ease-in-out cursor-pointer">
                        <MdModeEditOutline className="text-gray-900 text-lg" />
                    </button>

                    <button
                        onMouseOver={() => setHoverdltbtn(true)}
                        onMouseLeave={() => setHoverdltbtn(false)}
                        onClick={handleDelete}
                        className=" p-2 rounded-md border transition text-gray-950 px-2 py-0.5 flex items-center justify-center gap-1 border-gray-400 hover:ring-3 hover:ring-[#efeded]  duration-200 ease-in-out cursor-pointer">
                        <MdDelete className="text-gray-900 text-lg" />
                    </button>
                </div>
            )}
            {(hoveredtbtn) && (
                <div className="absolute right-6 -top-7 z-30 bg-gray-800 text-gray-200 rounded-xl px-3 py-2 shadow-lg">
                    Edit product
                    <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-gray-800">
                    </div>
                </div>
            )}
            {(hoverdltbtn) && (
                <div className="absolute -right-7 -top-7 z-30 bg-gray-800 text-gray-200 rounded-xl px-3 py-2 shadow-lg">
                    Delete product
                    <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-gray-800">
                    </div>
                </div>
            )}

            <pre className="whitespace-pre-wrap leading-6">

                <div className="flex gap-2 flex-wrap">
                    {product.images?.map((img, index) => (
                        <img
                            key={index}
                            className="w-20 h-16 rounded-md border border-gray-300 object-cover"
                            src={img.url}
                            alt={`${product.name}-${index}`}
                        />
                    ))}
                </div>
                <div className="mt-2">
                    <span className="font-bold text-gray-600">Name : </span>
                    <span className=" text-green-700">"{product.name}"</span>
                </div>
                <div className=" flex items-start">
                    <span className="font-bold text-gray-600">Slug : </span>
                    <span className=" text-green-700 ml-1 truncate block max-w-[300px]">"{product.slug}</span>
                    <span className="text-green-700">"</span>
                </div>
                <div className=" flex items-start">
                    <span className="font-bold text-gray-600">Description : </span>
                    <span className="text-green-700 ml-1 truncate block max-w-[300px]">"{product.desc}</span>
                    <span className="text-green-700">"</span>
                </div>
                <div>
                    <span className="font-bold text-gray-600">Price : </span>
                    <span className="text-blue-700">{product.price}</span>
                </div>
                <div>
                    <span className="font-bold text-gray-600">Category : </span>
                    <span className=" text-green-700">"{product.category}"</span>
                </div>


                <div>
                    <span className="font-bold text-gray-600">Available Quantity : </span>
                    <span className="text-blue-700">{product.availableQty}</span>
                </div>
                <div>
                    <span className="font-bold text-gray-600">createdAt : </span>
                    <span className="text-blue-700">
                        {product.createdAt
                            ? new Date(product.createdAt).toISOString()
                            : "Just now"}
                    </span>
                </div>
                <div>
                    <span className="font-bold text-gray-600">updatedAt : </span>
                    <span className="text-blue-700">
                        {product.updatedAt
                            ? new Date(product.updatedAt).toISOString()
                            : "—"}
                    </span>
                </div>
            </pre>

        </div>
    );
}
