import Router from 'express';
import { deleteMessageForEveryOneController} from '../controllers/deleteMessageForEveryOne.controller.js';
import middleWare from '../middle-ware/auth.middleWare.js';

const deleteMessageForEveryOneRoute = Router();
deleteMessageForEveryOneRoute
.route('/deleteForEveryOne/:messageId')
  .patch(middleWare,deleteMessageForEveryOneController);


export default deleteMessageForEveryOneRoute;