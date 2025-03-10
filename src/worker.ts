import "reflect-metadata";
import 'dotenv/config';
import { taskService } from "@services";
import { sleep } from "@utils";
import * as process from "node:process";

async function runWorker () {
    while (true) {
        const result = await taskService.runNewTask();
        if (!result) {
            await sleep(1000);
            console.log(`No task found, worker ${process.pid} sleeping 1000ms...`);
        }
    }
}

runWorker();