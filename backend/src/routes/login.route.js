import express from 'express';
import { longinUser } from '../controllers/login.controller.js';

const login = express.Router();
login.route('/login').post(longinUser);


export { login };
