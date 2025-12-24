"use client"
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("");

  const createTree = () => {
    router.push(`/generate?url=${text}`);
  }

  return (
    <main>

      <section className="bg-[#d2e823] min-h-[100vh] grid grid-cols-2 gap-10 ">
        <div className=" flex flex-col gap-4  justify-center ml-[10vw]">
          <p className="text-[#254f1a] font-bold text-7xl">A link in bio built for you.</p>
          <p className="text-[#254f1a] text-xl">Join 70M+ people using Linktree for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, TikTok, Twitter, YouTube and other social media profiles.</p>

          <div className="input flex gap-2 ">
            <input value={text} onChange={(e)=>setText(e.target.value)} className="px-2 py-2 focus:outline-white rounded-md bg-white text-gray-600" type="text" placeholder="Enter your Handle" />
            <button onClick={()=>createTree()} className="bg-[#254f1a] text-white font-semibold rounded-full px-4 py-4">Claim Your Bittree</button>
          </div>
        </div>
        <div className=" flex flex-col gap-2 items-center justify-center mr-[10vw]">
          <img className="rounded-3xl" src="/home2.jpg" alt="homepage image" />
        </div>
        
      </section>
      <section className="bg-red-500 min-h-[100vh]">

        
      </section>
    </main>
  );
}
