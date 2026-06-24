import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("new-user-registrations", (err, count) => {
    if (err) {
        console.error("Failed to subscribe to channel:", err);
    }
    else {
        console.log("Subscribed to channel:", count);
    }
});

subscriber.on("message", (channel, message) => {
    console.log(`Received message on channel "${channel}":`, message);
})