import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen text-black">
            {/* FIXED SIDEBAR */}
            <Sidebar />

            {/* MAIN AREA */}
            <div className="flex-1 ml-64">
                {/* FIXED TOPBAR */}
                <Topbar />

                {/* CONTENT SCROLLS */}
                <main className="px-6 pb-6 mt-16 h-[calc(100vh-64px)] overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
