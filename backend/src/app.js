import express from "express"
import { signUp } from "./routes/signup.route.js"
import { login } from "./routes/login.route.js"

const app=express()
app.use(express.json())

app.use("/api/v2",
    signUp,
    login

)


export {app}