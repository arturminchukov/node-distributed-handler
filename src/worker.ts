import "reflect-metadata";
import 'dotenv/config';
import { taskService } from "@services";
import { sleep } from "@utils";
import { threadId } from "node:worker_threads";

const workerId = threadId;

async function runWorker() {
    while (true) {
        const result = await taskService.runNewTask();
        if (!result) {
            await sleep(1000);
            console.log(`No task found, worker ${workerId} sleeping 1000ms...`);
        }
    }
}

runWorker();