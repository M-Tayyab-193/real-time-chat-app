import User from "../modals/users.js";
import jwt from 'jsonwebtoken'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found.' });

        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log("Auth Error: ", error.message);
    }
}