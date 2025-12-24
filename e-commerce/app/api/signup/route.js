// import User from "@/models/User";
// import connectDb from "@/db/connectDb";
// import CryptoJS from "crypto-js";



// export async function POST(req) {

//   await connectDb()
//   const body = await req.json()
//   const {name, email, password} = body
//   let newUser = await User.create({name, email, password: CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString()})
  
//   return Response.json({success: true}, newUser)
// } 

import User from "@/models/User";
import connectDb from "@/db/connectDb";
import CryptoJS from "crypto-js";

export async function POST(req) {
  await connectDb();
  const body = await req.json();
  const { name, email, password } = body;

  // Store role = "customer" by default. To create admin, set role manually in DB.
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    process.env.AES_SECRET 
  ).toString();

  let newUser = await User.create({
    name,
    email,
    password: encryptedPassword,
    role: "customer", // default, will be admin for selected users only
  });

  return Response.json({ success: true });
}
