import express from 'express';

import { loggedOutController} from '../controllers/loggedOut.controller.js';
import middleWare from '../middle-ware/auth.middleWare.js';
const loggedOutRouter =express.Router();

loggedOutRouter.route('/loggedOut').get( middleWare,loggedOutController);


export { loggedOutRouter };

