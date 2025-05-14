import express from "express"
import { signUpController } from "../controllers/signUp.controller.js"

const signUp=express.Router()
signUp.route("/sign-up").post(signUpController)


export{signUp}