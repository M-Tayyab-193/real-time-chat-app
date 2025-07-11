import User from "../modals/users.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/tokenGenerator.js";
import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, passsword, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        const user = await User.findOne({ email })

        if (user) {
            return res.json({ success: false, message: 'Account already existed.' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passsword, salt);

        const newUser = await User.create({ fullname, email, hashedPassword, bio });

        const token = generateToken(newUser._id);

        res.json({ success: true, userData: newUser, token, message: 'User Created Successfully.' })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
        console.log("Error: ", error.message);
    }
}

export const login = async (req, res) => {

    try {
        const { email, passsword } = req.body;

        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(passsword, userData.password);

        if (!isPasswordCorrect) {
            res.json({ success: false, message: 'Invalid Credentials' });
        }
        const token = generateToken(userData._id);

        res.json({ success: true, userData, token, message: 'Login Successfully.' })
    }
    catch (error) {
        res.json({ success: false, message: error.message })
        console.log("Error: ", error.message);
    }

}

export const updateProfile = async (req, res) => {
    try {

        const { fullName, profilePicture, bio } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if (!profilePicture) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true })
        }
        else {
            const upload = await cloudinary.uploader.upload(profilePicture);

            updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio, profilePicture: upload.secure_url }, { new: true });
        }
        res.json({ success: true, user: updatedUser })
    }
    catch (error) {
        res.json({ success: false, message: error.message });
        console.log("Error: ", error.message);
    }
}