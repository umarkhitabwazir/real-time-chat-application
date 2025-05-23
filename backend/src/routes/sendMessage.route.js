import express from 'express';
import middleWare from '../middle-ware/auth.middleWare.js';
import { sendMessageController } from '../controllers/sendMessage.controller.js';

const sendmessage = express.Router();

sendmessage.route('/send-message').post(middleWare,sendMessageController)


export default sendmessage;