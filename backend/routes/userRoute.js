import express from "express";
import UserController from "../controllers/userController.js";

import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/update-name', authenticate, UserController.updateName);

export default router;