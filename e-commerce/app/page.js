import Image from "next/image";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <video src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4" className="transition-opacity duration-400 overflow-clip pointer-events-none absolute top-0 left-0 w-full h-full object-cover opacity-100" autoPlay={true} loop={true} playsInline={true} muted={true} style={{ overflowClipMargin: 'content-box' }} />
      <div className=" absolute inset-0 flex flex-col justify-center items-center">
        <span className="text-7xl font-bold italic text-white py-5">Arigato</span>
        <span className="text-5xl font-semibold text-white py-1">ありがと</span>
        <span className="text-5xl font-semibold text-white">Food Van Website</span>
        <div className="flex flex-col justify-center items-center py-5">
          <span className="text-2xl font-semibold text-white">Your favorite meals, just a van away.</span>
          <span className="text-2xl font-semibold text-white">Discover. Track. Eat. Repeat.</span>
        </div>
      </div>
      
    </div>
  );
}
