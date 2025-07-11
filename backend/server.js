import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import { connectDB } from './config/db.js'
import userRouter from './routes/user_routes.js'

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use('/api/status', (req, res) => (
    res.send("Server is live.")
))
app.use('/api/user', userRouter);
await connectDB();

server.listen(PORT, () => (
    console.log('Server is running on PORT: ', PORT)
))