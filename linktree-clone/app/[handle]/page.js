import Link from "next/link"
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    const { handle } = await params
    const client = await clientPromise;
    const db = client.db("bittree");
    const collection = db.collection("link");

    const item = await collection.findOne({ handle: handle });
    if (!item) {
        return notFound()
    }

// This is an amazing page from codewithharry because it contains all the links from his social media.

    // const item2 = {
    //     "_id": {
    //         "$oid": "68f0cef3035e4352f5a67812"
    //     },
    //     "links": [
    //         {
    //             "link": "https://www.youtube.com/",
    //             "linktext": "youtube"
    //         }
    //     ],
    //     "handle": "Ramash",
    //     "pic": "https://avatars.githubusercontent.com/u/196349848?v=4"
    // }

    return <div className="flex bg-purple-400 min-h-screen justify-center py-10">
        {item && <div className="photo flex flex-col items-center gap-4">
            <img className="rounded-full w-24" src={item.pic} alt="" />
            <span className="font-bold">@{item.handle}</span>
            <span className="desc w-80 text-center">{item.desc}</span>
            <div className="links">
                {item.links.map((item, index) => {
                    return (
                        <Link key={index} href={item.link}><div className="px-2 py-4 bg-purple-100 rounded-md my-2 shadow-lg flex justify-center min-w-96">
                            {item.linktext}
                        </div></Link>
                    
                    )
                })}
            </div>
        </div>}
    </div>
    
}