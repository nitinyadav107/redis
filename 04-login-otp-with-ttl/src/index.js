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
function otpKey(phone) {
    return `user:${phone}:otp`;
}
app.post('/otp', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await redis.set(otpKey(phone), otp, 'EX', 60);
    console.log(`otp sent to ${phone} : ${otp}`)
    return res.status(200).json({ message: "otp sent successfully" });
})
app.post('/otp/verify', async (req, res) => {
    const { phone, otp } = req.body;
    const storedOtp = await redis.get(otpKey(phone));
    if (!storedOtp) {
        return res.status(400).json({ message: "otp expired" });
    }
    if (storedOtp === otp) {
        await redis.del(otpKey(phone));
        return res.status(200).json({ message: "otp verified successfully" });
    }
    return res.status(400).json({ message: "invalid otp" });
})
app.get('/otp/:phone/ttl', async (req, res) => {
    const { phone } = req.params;
    const ttl = await redis.ttl(otpKey(phone));
    if (ttl <= 0) {
        return res.status(404).json({ message: "otp not found" });
    }
    return res.status(200).json({ ttl: ttl });
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});