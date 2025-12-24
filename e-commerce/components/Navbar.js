"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { AiFillMinusCircle } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineShoppingCartCheckout, MdAccountCircle } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart, removeFromCart, clearCart, logoutUser, regenerateKey } from "@/redux/cart/cartSlice";
import { openSideCart, closeSideCart, toggleSideCart } from "@/redux/sidecart/uiSlice";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const user = useSelector((state) => state.cart.user?.value);
  const isOpen = useSelector((state)=> state.sidecart.isSideCartOpen)
  const dispatch = useDispatch();
  const router = useRouter()
  const ref = useRef()
  const pathname = usePathname();

  const [dropdown, setDropdown] = useState(false)

  const cartArray = Object.entries(cartItems); // Convert object to array [[itemcode, {...data}], ...]
  const hideOn = ["/myaccount", "/admin", "/admin/users", "/admin/products", "/admin/orders"]; // add more patterns if needed

  if (hideOn.includes(pathname)) return null;

  const handleLogout = async () => {
  await fetch("/api/logout", { method: "GET" });
  localStorage.removeItem("myuser");
  dispatch(logoutUser());
  dispatch(regenerateKey())
  router.push("/");
};

  return (<>
    <header className="text-gray-600 bg-gray-200 body-font shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          href={"/"}
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <span className="ml-3 text-2xl font-bold">Arigato</span>
        </Link>

        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href={"/burgers"} className="mr-5 hover:text-gray-900">
            Burgers
          </Link>
          <Link href={"/drinks"} className="mr-5 hover:text-gray-900">
            Drinks
          </Link>
        </nav>

        {/* <Link
          href={"/login"}
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0 mx-2"
        >
          Login
        </Link>

        <Link
          href={"/signup"}
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0 mx-2"
        >
          Sign Up
        </Link> */}

        {/* 🛒 Shopping Cart Drawer */}
        <div className="cart text-white px-3 py-2 text-2xl">
          <button className="flex relative gap-3 justify-center items-center cursor-pointer text-gray-900" >
            <span onMouseOver={() => { setDropdown(true) }} onMouseLeave={() => { setDropdown(false) }}>
              {dropdown && <div onMouseOver={() => { setDropdown(true) }} onMouseLeave={() => { setDropdown(false) }} className="absolute right-9 top-6 z-20  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-34 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >
                  <li className="text-start">
                    <Link href={"/myaccount"} className="block px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">My Account</Link>
                  </li>
                  <li className="text-start">
                    <Link href={"/orders"} className="block px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">My Orders</Link>
                  </li>
                  <li className="text-start">
                    <span className="block px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</span>
                  </li>
                  <li onClick={() => { handleLogout(), setDropdown(false) }} className="text-start">
                    <span className="block px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Logout</span>
                  </li>
                </ul>
              </div>}
              {user && <div ><MdAccountCircle /></div>}
            </span>
            {!user && <>
              <Link href={"/login"} className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-300 rounded text-base mt-4 md:mt-0 mx-2" >Login</Link>
            </>}
            <FaCartPlus onClick={() => dispatch(openSideCart())} />
          </button>

        </div>
      </div>
    </header>
    <div ref={ref} className={`sideCart h-screen bg-gray-100 fixed z-10 top-0 right-0 px-4 py-4 outline-1 outline-gray-300 text-black transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`} >
      <div className="h-screen flex flex-col justify-between pb-2">


        <div className="w-85 text-black">
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold mx-3" >Shopping Cart</h2>
            <button onClick={() => dispatch(closeSideCart())} className="cursor-pointer text-gray-500 hover:text-gray-700" >
              <RxCross1 className="w-10 text-xl" />
            </button>
          </div>

          {/* 🧾 Cart Items */}
          <div className="mt-8 h-[70vh] overflow-y-auto ">
            {cartArray.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className=" divide-y divide-gray-200 select-none mx-3 shadow-md overflow-hidden">
                {cartArray.map(([itemcode, item]) => (
                  <li key={itemcode} className="flex py-6 px-2">
                    <div className="size-20 shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 justify-between  flex-col">
                      <div className="flex justify-between gap-2 px-1 text-base font-medium text-gray-900">
                        <div className="flex flex-col gap-1">
                          <h3>{item.name}</h3>
                          <h3 className="text-[10px] font-normal">{item.desc}</h3>
                        </div>
                        <p>₹{item.price}</p>
                      </div>
                      <div className="flex items-center justify-end gap-1 my-2">
                        <button
                          onClick={() => dispatch(removeFromCart({ itemcode: itemcode }))}
                          className="text-lg text-gray-800 hover:text-gray-500 cursor-pointer"
                        >
                          <AiFillMinusCircle />
                        </button>
                        <p className="text-[12px] font-semibold">{item.qty}</p>
                        <button
                          onClick={() => dispatch(addToCart({ itemcode, name: item.name, desc: item.desc, price: item.price, qty: 1 }))}
                          className="text-lg text-gray-800 hover:text-gray-500 cursor-pointer"
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
        <div className=" px-2 pb-6 pt-2 border-t border-gray-400">
          <div className="flex justify-between text-base px-1 font-medium text-gray-900 select-none">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>

          <div className="mt-6 flex justify-between gap-3 select-none">
            <Link href="/checkout" className="flex gap-1 w-6/10 items-center justify-center text-base font-medium text-white cursor-pointer" >
              <button disabled={cartArray.length === 0} onClick={() => dispatch(toggleSideCart())} className="flex gap-1 disabled:bg-gray-400 w-full items-center justify-center rounded-md bg-gray-600 px-3 py-4 text-base font-medium text-white hover:bg-gray-700 cursor-pointer">

                <MdOutlineShoppingCartCheckout className="text-lg" />
                Checkout

              </button>
            </Link>
            <button
              onClick={() =>{ 
                dispatch(clearCart())
                dispatch(closeSideCart())
              }}
              disabled={cartArray.length === 0}
              className="flex items-center w-4/10 justify-center rounded-md disabled:bg-gray-400 bg-gray-600 px-6 py-4 text-base font-medium text-white hover:bg-gray-700 cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  </>
  );
};

export default Navbar;
