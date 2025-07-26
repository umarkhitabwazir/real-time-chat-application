import express from "express";
import {  updateUserInfoController } from "../controllers/updateUserInfo.controller.js";
import { upload } from '../middle-ware/multer.middle.js'
import  middleWare from '../middle-ware/auth.middleWare.js'

const updatedUserRoute = express.Router();

updatedUserRoute.route("/updateUserInfo")
    .post( middleWare,upload.single('profile'), updateUserInfoController);


export default updatedUserRoute;