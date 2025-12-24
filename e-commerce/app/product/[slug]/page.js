import { notFound } from "next/navigation";
import Product from "@/models/Product";
import connectDb from "@/db/connectDb";
import ProductClient from "@/components/ProductClient";

export default async function Page({ params }) {
  await connectDb();

  const { slug } = await params; 
  const product = await Product.findOne({ slug });

  if (!product) {
    return notFound(); // Automatically loads app/not-found.js
  }

  return (
    <ProductClient product={JSON.parse(JSON.stringify(product))} slug={slug} />
  );
}
