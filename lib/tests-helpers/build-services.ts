import { BuildFirebase } from "@src/Services.js"
import dotenv from "dotenv"
dotenv.config()

export async function BuildServicesTest() {
  return await BuildFirebase(
    {
      apiKey: process.env.API_KEY!,
      authDomain: process.env.AUTH_DOMAIN!,
      projectId: process.env.PROJECT_ID!,
      storageBucket: process.env.STORAGE_BUCKET!,
      messagingSenderId: process.env.MESSAGING_SENDER_ID!,
      appId: process.env.APP_ID!
    },
    "Simple Firebase",
    { env: "test" }
  )
}
