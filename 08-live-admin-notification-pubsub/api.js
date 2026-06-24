import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const users = [];
let userId = 1;

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    // Create user
    const user = {
        id: userId++,
        name,
        email,
        password
    };

    users.push(user);

    // Publish event to Redis channel 'notifications'
    await publisher.publish("notifications", JSON.stringify({
        type: "user_registered",
        user,
        timestamp: new Date()
    }));

    res.json({ message: "User registered successfully!", user });
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});