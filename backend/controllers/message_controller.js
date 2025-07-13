import Message from "../modals/message.js";
import User from "../modals/users.js";
import cloudinary from "../config/cloudinary.js";
import { io, userSocketMap } from '../server.js'

// GET all the chats for a particular user

export const getUsersForChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })
            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({
            success: true, users: filteredUsers, unseenMessages
        })
    }

    catch (error) {
        res.status(500).json({
            success: false, message: error.message
        })
        console.log("Error: ", error.message);
    }
}

// GET all the messages of a particular chat

export const getAllMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });

        res.json({
            success: true, messages
        })

    }
    catch (error) {
        res.status(500).json({
            success: false, message: error.message
        })
        console.log("Error: ", error.message);
    }
}

// Mark individual message as seen; for real-time experience

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });

        res.json({
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            success: false, message: error.message
        })
        console.log("Error: ", error.message);
    }
}

// Function to send a message to a particular user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId, receiverId, text, image: imageUrl
        });

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        res.json({
            success: true,
            newMessage
        });

    }
    catch (error) {
        res.status(500).json({
            success: false, message: error.message
        })
        console.log("Error: ", error.message);
    }
}
