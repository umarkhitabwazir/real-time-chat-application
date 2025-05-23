import express from 'express';
import { checkUser } from '../controllers/checkUser.controller.js';

const checkUserRoute = express.Router();
checkUserRoute.route('/check-user/:username').get(checkUser);

export default checkUserRoute;