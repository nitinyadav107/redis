import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
    console.log('Successfully connected to Redis!');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
    await redis.set(BANNER_KEY, req.body.message || "Welcome to chai aur redis");
    return res.status(200).json({message: "banner set successfully"});
});

app.get("/banner", async (req, res) => {
    const message = await redis.get(BANNER_KEY);
    if (!message) return res.status(404).json({message: "banner not found"});
    return res.status(200).json({message: message});
});

app.delete("/banner", async (req, res) => {
    await redis.del(BANNER_KEY);
    return res.status(200).json({message: "banner deleted successfully"});
});

app.get("/banner/exists", async (req, res) => {
    const exists = await redis.exists(BANNER_KEY);
    return res.status(200).json({exists: exists});
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
