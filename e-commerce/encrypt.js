import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config(); // loads .env file

// Put your admin password here
const password = "ramash7076";

// Load AES secret
const secret = process.env.AES_SECRET;

if (!secret) {
  console.error("❌ AES_SECRET is missing. Add it to .env file.");
  process.exit(1);
}

const encrypted = CryptoJS.AES.encrypt(password, secret).toString();

console.log("Encrypted Password:", encrypted);
