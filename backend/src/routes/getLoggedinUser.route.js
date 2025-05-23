import express from 'express';
import getLoggedInUser from '../controllers/getLoggedinUser.controller.js';
import middleWare from '../middle-ware/auth.middleWare.js';


const loggedInUserRoute = express.Router();
loggedInUserRoute.route('/logged-in-user').get( middleWare,getLoggedInUser) 


export default loggedInUserRoute;
