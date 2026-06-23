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
app.post("/user/:id/json", async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body), "EX", 3600);
    return res.status(200).json({ message: "user saved successfully" });
})
app.get("/user/:id/json", async (req, res) => {
    const userJson = await redis.get(`user:${req.params.id}:json`);
    return res.status(200).json(JSON.parse(userJson));
})
app.post("user/:id/hash", async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    return res.status(200).json({ message: "user saved successfully" });
})
app.get("user/:id/hash", async (req, res) => {
    const userHash = await redis.hgetall(`user:${req.params.id}:hash`);
    return res.status(200).json(userHash);
})