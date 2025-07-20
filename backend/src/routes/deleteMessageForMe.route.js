import { Router } from "express";
import { deleteMessageForMeController } from "../controllers/deleteMessageForMe.controller.js";
import middleWare from "../middle-ware/auth.middleWare.js";
const deleteMessageForMeRoute=Router();
deleteMessageForMeRoute.route("/deleteForMe/:messageId").patch(middleWare,deleteMessageForMeController);

export default deleteMessageForMeRoute;