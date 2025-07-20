import express from "express"
import { signUp } from "./routes/signup.route.js"
import { login } from "./routes/login.route.js"
import sendmessage from "./routes/sendMessage.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import { ApiError } from "./utils/api-error.js"
import fetchAllMessageRoute from "./routes/fetchAllMessage.route.js"
import getLoggedInUserRoute from "./routes/getLoggedinUser.route.js"
import checkUserRoute from "./routes/checkUser.route.js"
import  {loggedOutRouter} from "./routes/loggedOut.route.js";
import deleteMessageForEveryOneRoute from "./routes/deleteMessageForEveryOne.route.js"
import deleteMessageForMeRoute from "./routes/deleteMessageForMe.route.js"
console.log("process.env.origin", process.env.origin);
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.origin,
    credentials: true,
}))

app.use("/api",
    signUp,
    login,
    sendmessage,
    fetchAllMessageRoute,
    getLoggedInUserRoute,
    checkUserRoute,
    loggedOutRouter,
    deleteMessageForEveryOneRoute,
    deleteMessageForMeRoute,

)
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        console.log('error', err);
        res.status(err.statusCode || 500).json({
            status: err.statusCode || 500,
            error: err.message || "Internal Server Error",
        })
    } else {
        console.log("use middleware error", err);
      
        res.status(500).json({
            status: 500,
            error: "Internal Server Error",
        })
    }
})


export { app }