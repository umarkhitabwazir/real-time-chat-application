import { Router } from "express";
import passport from "passport";
import { passportController } from "../controllers/passport.controller.js";

const passportRouter = Router();

passportRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] })
);
passportRouter.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  passportController

);







export default passportRouter;