import mongoose from 'mongoose'
import doenv from "dotenv"

doenv.config({
    path:".env"
})
const db_url=process.env.DB_URL


const dbConnect=async()=>{
await mongoose.connect(db_url)
}
export {dbConnect}