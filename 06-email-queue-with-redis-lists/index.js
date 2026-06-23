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

const QUEUE_KEY = 'queue:emails';

app.post('/emails', async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No body'
    }
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    return res.status(200).json({ message: "email added to queue", job });
});

app.get('/emails/count', async (req, res) => {
    const count = await redis.llen(QUEUE_KEY);
    return res.status(200).json({ count });
});

app.get('/emails/process', async (req, res) => {
    const job = await redis.rpop(QUEUE_KEY);
    if (!job) {
        return res.status(404).json({ message: 'queue is empty' });
    }
    console.log('processing job', job);
    return res.status(200).json({ job });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
