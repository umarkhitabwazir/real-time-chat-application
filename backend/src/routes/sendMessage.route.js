import express from 'express';
import middleWare from '../middle-ware/auth.middleWare.js';
import { sendMessageController } from '../controllers/sendMessage.controller.js';
import { upload } from '../middle-ware/multer.middle.js';

const sendmessage = express.Router();

sendmessage.route('/send-message').post(middleWare,upload.single('img'),sendMessageController)


export default sendmessage;