import Link from 'next/link'
import React from 'react'
import connectDb from '@/db/connectDb'
import Product from '@/models/Product'

const Burgers = async () => {
    await connectDb();
    const products = JSON.parse(JSON.stringify(await Product.find({category: "burgers"})));
    return (
        <div>
            <section className="text-gray-600 body-font min-h-screen">
                <div className="container px-5 py-14 mx-auto">
                    <div className="flex flex-wrap -m-4 justify-center">


                        {products.map((item) =>{return( <Link key={item._id} href={`/product/${item.slug}`} className="lg:w-1/4 md:w-1/2 p-4 w-full shadow-lg m-3">
                            <div className="block relative rounded overflow-hidden">
                                <img alt={item.name} className="h-[36vh] block" src={item.image} />
                            </div>
                            <div className="mt-4">
                                <h2 className="text-gray-900 title-font text-lg font-medium">{item.name}</h2>
                                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{item.desc}</h3>
                                <p className="mt-1">₹{item.price}</p>
                            </div>
                        </Link>)})}






                    </div>
                </div>
            </section>
        </div>
    )
}

export default Burgers
