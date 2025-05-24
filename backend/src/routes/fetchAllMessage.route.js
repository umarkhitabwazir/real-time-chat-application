import express from 'express';
import middleWare from '../middle-ware/auth.middleWare.js';
import fetchAllMessagesController from '../controllers/fetchAllMessages.controller.js';

const fetchAllMessageRoute = express.Router();

fetchAllMessageRoute.route('/fetch-all-message').get(middleWare,fetchAllMessagesController);
export default fetchAllMessageRoute;
