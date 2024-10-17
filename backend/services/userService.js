import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

class UserService {
    static async register (data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new User({ ...data, password: hashedPassword });
        return await user.save();
    };

    static async findUserByEmail (email) {
        return await User.findOne({ email });
    };
}

export default UserService;


