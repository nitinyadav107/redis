import { connection } from "./queue";
const worker = new Worker(
    "emails",
    async (job) => {
        console.log("Processing email job...", job.id, job.name, job.date);
        (await new Promise((resolve) => setTimeout(resolve, 1500)),
            console.log("email job completed")
        );
    },
    { connection }
)
worker.on("error", (error) => {
    console.error("Error processing job:", error);
});
worker.on("completed", (job, result) => {
    console.error(`Job ${job.id} completed:`, result);
});
