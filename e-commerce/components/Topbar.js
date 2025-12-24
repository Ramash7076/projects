"use client"
import { useSelector } from "react-redux";

export default function Topbar() {
    const user = useSelector((state) => state.cart.user);

    return (
        <header className="bg-white shadow p-4 flex items-center justify-between fixed top-0 left-64 right-0 h-16 z-30">
            <div className="text-lg font-semibold">Admin Panel</div>
            <div className="flex items-center gap-4">
                <div>Signed in as <strong>{user?.email}</strong></div>
            </div>
        </header>
    );
}
