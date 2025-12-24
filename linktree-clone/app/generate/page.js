"use client"
import React from 'react'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useSearchParams } from 'next/navigation'

const Generate = () => {
    const searchParams = useSearchParams()

    // const [link, setLink] = useState("");
    // const [linkText, setLinkText] = useState("");
    const [links, setLinks] = useState([{ link: "", linktext: "" }])
    const [handle, setHandle] = useState(searchParams.get("handle"))
    const [pic, setPic] = useState("")
    const [desc, setDesc] = useState("")

    const handleChange = (index, link, linktext) => {
        setLinks((initialLinks) => {
            return initialLinks.map((item, i) => {
                if (i === index) {
                    return { link, linktext }
                }
                else {
                    return item
                }
            })

        })
    }

    const addlink = () => {
        setLinks(links.concat([{ link: "", linktext: "" }]))
    }

    const submitLinks = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "links": links,
            "handle": handle,
            "pic": pic,
            "desc": desc
        });

        console.log(raw)

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        let r = await fetch("http://localhost:3000/api/add", requestOptions)
        let result = await r.json()
        if (result.success) {
            toast.success(result.message)
            setLinks([])
            setHandle("")
            setPic("")
            setDesc("")
        }
        else{
            toast.error(result.message)
        }

    }

    return (
        <>

            <ToastContainer />
            <div className='bg-[#225ac0] min-h-screen grid grid-cols-2'>
                <div className="col1 flex flex-col justify-center items-center text-gray-900">
                    <div className='flex flex-col gap-5 my-8'>
                        <h1 className='font-bold text-4xl'>Create your Bittree</h1>
                        <div className="item">
                            <h2 className='font-semibold text-2xl'>Step 1: Claim your Handle</h2>
                            <div className="mx-4">
                                <input value={handle || ""} onChange={e => { setHandle(e.target.value) }} className='px-4 my-2 py-2 bg-white focus:outline-blue-700 rounded-full' type="text" placeholder='Choose a handle' />
                            </div>
                        </div>
                        <div className="item">
                            <h2 className='font-semibold text-2xl'>Step 2: Add Links</h2>
                            {links && links.map((item, index) => {
                                return <div key={index} className="mx-4">
                                    <input value={item.linktext || ""} onChange={e => { handleChange(index, item.link, e.target.value) }} className='px-4 py-2 bg-white focus:outline-blue-700 rounded-full mx-2 my-2' type="text" placeholder='Enter link text' />
                                    <input value={item.link || ""} onChange={e => { handleChange(index, e.target.value, item.linktext) }} className='px-4 py-2 bg-white focus:outline-blue-700 rounded-full mx-2 my-2' type="text" placeholder='Enter link' />
                                </div>
                            })}
                            <button onClick={() => addlink()} className='p-5 py-2 rounded-3xl mx-2 font-semibold bg-slate-900 text-white'>+ Add Link</button>
                        </div>
                        <div className="item">
                            <h2 className='font-semibold text-2xl'>Step 3: Add Picture and Description</h2>
                            <div className="mx-4 flex flex-col">
                                <input value={pic || ""} onChange={e => { setPic(e.target.value) }} className='px-4 my-2 py-2 bg-white focus:outline-blue-700 rounded-full' type="text" placeholder='Enter link to your picture' />
                                <input value={desc || ""} onChange={e => { setDesc(e.target.value) }} className='px-4 my-2 py-2 bg-white focus:outline-blue-700 rounded-full' type="text" placeholder='Enter description' />
                                <button disabled={handle == "" || pic == "" || links[0].linktext == 0} onClick={() => { submitLinks() }} className='disabled:bg-slate-700 p-5 py-2 rounded-3xl w-fit mx-2 my-5 font-semibold bg-slate-900 text-white'>Create your Bittree</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col2 h-screen">
                    <img className='h-full w-full object-cover' src="/loginimg.jpg" alt="login image" />
                </div>
            </div>
        </>
    )
}

export default Generate
