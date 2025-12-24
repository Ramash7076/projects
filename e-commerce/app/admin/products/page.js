"use client"
import { ProductCard } from '@/components/ProductCard';
import React, { useEffect, useState } from 'react'
import { MdAddCircle, MdModeEditOutline, MdDelete } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { openSideCart, closeSideCart } from '@/redux/sidecart/uiSlice'
import slugify from "slugify";

const Products = () => {
    const [products, setProducts] = useState([])
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoverdltbtn, setHoverdltbtn] = useState(false);
    const [form, setForm] = useState({ name: '', slug: '', price: '', category: '', description: '', availableQty: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [removedImagePublicIds, setRemovedImagePublicIds] = useState([]);

    const [counts, setCounts] = useState({ users: 0, products: 0, orders: 0 });
    const isOpen = useSelector((state) => state.sidecart.isSideCartOpen)
    const dispatch = useDispatch()

    useEffect(() => {
        loadProducts();
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        const res = await fetch("/api/getuser");
        const data = await res.json();
        setCounts(data);
    };

    const loadProducts = async () => {
        const res = await fetch("/api/getproducts");
        const data = await res.json();
        setProducts(data.products);
    };

    const handleImageUpload = (files) => {
        const selectedFiles = Array.from(files);

        if (images.length + selectedFiles.length > 5) {
            alert("Maximum 5 images allowed");
            return;
        }

        setImages((prev) => [...prev, ...selectedFiles]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "name") {
            setForm({
                ...form,
                name: value,
                slug: slugify(value, { lower: true, strict: true }),
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const uploadImages = async () => {
        const uploads = images.map(async img => {
            const fd = new FormData();
            fd.append("images", img);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: fd,
            });
            return await res.json();
        });

        const results = await Promise.all(uploads);
        return results.flatMap(r => r.images);
    };

    const submitProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let uploadedImages = [];

            if (images.length > 0) {
                uploadedImages = await uploadImages();
            }

            // FINAL image list
            const finalImages = [
                ...(editingProduct?.images || []),
                ...uploadedImages,
            ];

            const payload = {
                id: editingProduct?._id,
                name: form.name,
                slug: form.slug,
                price: Number(form.price),
                category: form.category.toLowerCase(),
                desc: form.description,
                availableQty: Number(form.availableQty),
                images: finalImages,
                removedImagePublicIds,
            };

            const url = editingProduct
                ? "/api/updateproducts"
                : "/api/addproducts";

            const method = editingProduct ? "PUT" : "POST";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            loadProducts();
            fetchCounts();
            dispatch(closeSideCart());

        } catch (err) {
            alert("Something went wrong");
        } finally {
            setForm({ name: '', slug: '', price: '', category: '', description: '', availableQty: '' });
            setImages([]);
            setEditingProduct(null);
            setRemovedImagePublicIds([]);
            setLoading(false);
        }
    };

    const handleDeleteFromUI = (id) => {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        loadProducts();
        fetchCounts();
    };

    const handleDeleteAll = async () => {
        const confirmDelete = confirm(
            "⚠️ Are you want to delete ALL products and images. Are you sure?"
        );
        if (!confirmDelete) return;

        const res = await fetch("/api/delete-all-products", {
            method: "DELETE",
        });

        const data = await res.json();

        if (data.success) {
            setProducts([]); // instant UI clear
            loadProducts()
            fetchCounts()
        }
    };

    const resetProductForm = () => {
        setEditingProduct(null);
        setForm({
            name: "",
            slug: "",
            price: "",
            category: "",
            description: "",
            availableQty: "",
        });
        setImages([]);
        setRemovedImagePublicIds([]);
    };




    return (<>
        <div className="min-h-screen  text-white p-6 space-y-3">
            <div className='sticky top-0 z-20 bg-white shadow-[0_2px_3px_-1px_rgba(0,0,0,0.1)] py-4 flex justify-between'>
                <h1 className="text-2xl font-semibold text-gray-800">Products ({counts.products})</h1>
                <div className='flex items-center gap-2'>
                    <button onClick={() => {
                        resetProductForm();     // RESET STATE
                        dispatch(openSideCart());
                    }} className='text-white bg-[#15743c] hover:bg-[#126233] border rounded-md px-2 py-0.5 flex items-center justify-center gap-1 border-gray-400  hover:ring-3 hover:ring-[#d4f0e0] transition duration-200 ease-in-out cursor-pointer'> <MdAddCircle className='text-gray-200 opacity-95' /><span className='font-bold text-[12px]'>ADD PRODUCT</span></button>

                    <button className='text-gray-950 border rounded-md px-2 py-0.5 flex items-center justify-center gap-1 border-gray-400 hover:ring-3 hover:ring-[#efeded] transition duration-200 ease-in-out cursor-pointer'> <MdModeEditOutline className='text-gray-400' /><span className='font-bold text-[12px]'>UPDATE</span></button>

                    <button
                        onClick={handleDeleteAll}
                        onMouseOver={() => setHoverdltbtn(true)}
                        onMouseLeave={() => setHoverdltbtn(false)}
                        className='text-gray-950 border rounded-md px-2 py-0.5 flex items-center justify-center gap-1 border-gray-400 hover:ring-3 hover:ring-[#efeded] transition duration-200 ease-in-out cursor-pointer'> <MdDelete className='text-gray-400' /><span className='font-bold text-[12px]'>DELETE</span></button>
                    {(hoverdltbtn) && (
                        <div className="absolute -right-8.5 -top-6 z-9999 bg-gray-800 text-gray-200 text-[12px] font-mono rounded-xl px-3 py-2 shadow-lg">
                            Delete all products
                            <div className="absolute z-40 left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-gray-800">
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-2 space-y-3">
                {
                    products.map((p) => (
                        <ProductCard
                            key={p._id}
                            product={p}
                            onDelete={handleDeleteFromUI}
                            onEdit={(product) => {
                                setEditingProduct(product);
                                setForm({
                                    name: product.name,
                                    slug: product.slug,
                                    price: product.price,
                                    category: product.category,
                                    description: product.desc,
                                    availableQty: product.availableQty,
                                });
                                setImages([]); // only NEW images here
                                setRemovedImagePublicIds([]);
                                dispatch(openSideCart());
                            }}
                        />
                    ))
                }
            </div>

            {/* Add product form */}
            <div className={`fixed left-0 right-0 top-0 z-50 ${isOpen ? "block" : "hidden"}  h-screen backdrop-brightness-60 backdrop-blur-[1px] w-full items-center justify-center overflow-y-auto overflow-x-hidden antialiased`}>
                <div className="mx-auto relative min-h-full w-full max-w-xl p-4 ">

                    <div className="relative rounded-3xl bg-white shadow ">

                        <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4  md:p-5">
                            <h3 className="text-lg font-semibold text-gray-900 ">{editingProduct ? "Update Product" : "Insert Product"}</h3>
                            <button onClick={() => {
                                resetProductForm();     // RESET STATE
                                dispatch(closeSideCart());
                            }} type="button" className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900  cursor-pointer">
                                <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form onSubmit={submitProduct} className="p-4 md:p-5">
                            <div className="my-2 grid grid-cols-1 gap-4 sm:grid-cols-2">


                                <div className="col-span-2 ">
                                    <div className="relative">
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            placeholder=" "
                                            required
                                            className="peer block w-full rounded-lg border border-gray-300  px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                                        />

                                        <label
                                            htmlFor="name"
                                            className="absolute left-2.5 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-blue-600 cursor-text" >
                                            Product Name*
                                        </label>
                                    </div>
                                </div>

                                <div className="col-span-2 ">
                                    <div className="relative">
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            id="slug"
                                            name="slug"
                                            value={form.slug}
                                            placeholder=" "
                                            required
                                            className="peer block w-full rounded-lg border border-gray-300  px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                                        />

                                        <label
                                            htmlFor="slug"
                                            className="absolute left-2.5 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-blue-600 cursor-text" >
                                            Product slug*
                                        </label>
                                    </div>
                                </div>

                                <div className="col-span-2 ">
                                    <div className="relative">
                                        <input
                                            onChange={handleChange}
                                            type="text"
                                            id="category"
                                            name="category"
                                            value={form.category}
                                            placeholder=" "
                                            required
                                            className="peer block w-full rounded-lg border border-gray-300  px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                                        />

                                        <label
                                            htmlFor="category"
                                            className="absolute left-2.5 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-blue-600 cursor-text" >
                                            Product Category*
                                        </label>
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <div className="relative">
                                        <input
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Allow only numbers
                                                if (/^\d*$/.test(value)) {
                                                    handleChange(e);   // Only call handleChange when it's valid
                                                }
                                            }}
                                            type="text"
                                            id="price"
                                            name="price"
                                            value={form.price}
                                            placeholder=" "
                                            inputMode="numeric"
                                            pattern="\d*"
                                            required
                                            className="peer block w-full rounded-lg border border-gray-300  px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                                        />

                                        <label
                                            htmlFor="price"
                                            className="absolute left-2.5 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-blue-600 cursor-text" >
                                            Product Price*
                                        </label>
                                    </div>
                                </div>


                                <div className="col-span-2 sm:col-span-1">
                                    <div className="relative">
                                        <input
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                // Allow only numbers
                                                if (/^\d*$/.test(value)) {
                                                    handleChange(e);   // Only call handleChange when it's valid
                                                }
                                            }}
                                            type="text"
                                            id="availableQty"
                                            name="availableQty"
                                            value={form.availableQty}
                                            placeholder=" "
                                            inputMode="numeric"
                                            pattern="\d*"
                                            required
                                            className="peer block w-full rounded-lg border border-gray-300  px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                                        />

                                        <label
                                            htmlFor="availableQty"
                                            className="absolute left-2.5 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-blue-600 cursor-text" >
                                            Product Quantity*
                                        </label>
                                    </div>
                                </div>

                                <div className="col-span-2 ">

                                    <div className="relative">
                                        <textarea
                                            onChange={handleChange}
                                            id="description"
                                            name='description'
                                            value={form.description}
                                            rows="2"
                                            placeholder=" "
                                            required
                                            className="peer block w-full rounded-lg border border-gray-300  px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                                        ></textarea>
                                        <label
                                            htmlFor="description"
                                            className="absolute left-2.5 top-2 z-10 origin-left -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-blue-600 cursor-text" >
                                            Product Description*
                                        </label>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 ">
                                        Product Images*
                                    </label>

                                    <div
                                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2 text-center transition hover:bg-gray-100 "
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            handleImageUpload(e.dataTransfer.files);
                                        }}
                                        onClick={() => document.getElementById("imageUpload").click()}
                                    >
                                        <svg className=" h-10 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /> </svg>

                                        <p className="mb-1 text-sm text-gray-600 "> <span className="font-semibold">Click to upload</span> or drag and drop </p>
                                        <p className="text-xs text-gray-500 "> PNG, JPG, WEBP (Max 5 images) </p>

                                        <input
                                            id="imageUpload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e.target.files)}
                                        />
                                    </div>

                                    {editingProduct?.images?.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                                            {editingProduct.images.map((img, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={img.url}
                                                        className="h-15 w-full rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setRemovedImagePublicIds(prev => [...prev, img.public_id]);
                                                            setEditingProduct(prev => ({
                                                                ...prev,
                                                                images: prev.images.filter((_, i) => i !== index),
                                                            }));
                                                        }}
                                                        className="absolute right-1 top-1 rounded-full bg-gray-400 p-1 text-xs text-white text-center cursor-pointer"
                                                    >
                                                        <RxCross2 className="text-gray-700" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Preview Section */}
                                    {images.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                                            {images.map((img, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        alt="preview"
                                                        className="h-15 w-full rounded-lg object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute right-1 top-1 rounded-full bg-gray-400 p-1 text-xs text-white text-center cursor-pointer"
                                                    >
                                                        <RxCross2 strokeWidth={1} className='text-gray-600' />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="flex gap-3 justify-end border-t border-gray-200 pt-4  md:pt-5">
                                <button onClick={() => {
                                    resetProductForm();     // RESET STATE
                                    dispatch(closeSideCart());
                                }} type="button" data-modal-toggle="accountInformationModal2" className=" rounded-lg border border-gray-400 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:ring-3 hover:ring-[#efeded] focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 cursor-pointer">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`me-3 inline-flex items-center cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 hover:ring-3 hover:ring-[#85b4dca9]"}`}
                                >
                                    {loading
                                        ? "Saving..."
                                        : editingProduct
                                            ? "Update"
                                            : "Insert"}

                                </button>

                            </div>
                        </form>

                    </div>
                </div>
            </div >
        </div>

    </>
    );
}

export default Products
