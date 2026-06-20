const express = require('express');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Redis
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis!');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

app.get('/', async (req, res) => {
  try {
    // Increment a visitor counter in Redis
    const count = await redis.incr('visitors');
    res.json({
      message: 'Hello from Express and Redis!',
      visitors: count
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});