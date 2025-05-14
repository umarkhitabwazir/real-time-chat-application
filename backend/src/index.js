import { app } from "./app.js"
import dotenv from "dotenv"
import { dbConnect } from "./db/db.js"
import { ApiError } from "./utils/api-error.js"

dotenv.config({
    path:".env"
})
const port=process.env.PORT

dbConnect().then(()=>
app.listen(port,()=>{
    console.log(`app listing on ${port}`)
})
).catch((error)=>{
    console.log("DB connection failed:",error)
    throw new ApiError(501,"DB connection failed")
})
