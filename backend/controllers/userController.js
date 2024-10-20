import UserService from '../services/userService.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


class UserController {
    static async register (req, res) {
        try {
            const user = await UserService.register(req.body);
            res.status(201).json(user);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };

    static async login (req, res) {
        try {
            const user = await UserService.findUserByEmail(req.body.email);
                if (user && (await bcrypt.compare(req.body.password, user.password))) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                res.json({ token, user });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };

    static async updateName(req, res) {
        const { userId, newName } = req.body;
        try {
            const updatedUser = await UserService.updateUserName(userId, newName);
            if (updatedUser) {
                console.log("Updated user :", updatedUser);
                res.json(updatedUser);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    };
}

export default UserController;