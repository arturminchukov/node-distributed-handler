import "reflect-metadata";
import 'dotenv/config';
import { taskService } from "@services";
import { sleep } from "@utils";
import { threadId } from "node:worker_threads";

const workerId = threadId;

const SLEEP_TIMEOUT = 60 * 1000;

async function runWorker () {
    while (true) {
        const result = await taskService.closeTimeoutTasks();
        if (!result) {
            await sleep(SLEEP_TIMEOUT);
            console.log(`No timeout tasks found, cleaner worker ${workerId} sleeping ${SLEEP_TIMEOUT/1000}s...`);
        }
    }
}

runWorker();