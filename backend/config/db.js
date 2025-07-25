import mongoose from 'mongoose'


export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => (console.log('DB is connected')))

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);

    }
    catch (error) {
        console.log('Error:', error);
    }
}