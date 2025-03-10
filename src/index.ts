import * as console from "node:console";
import { Worker } from 'worker_threads';
import * as path from "node:path";
import { fileURLToPath } from 'url';

// A little trick to get __dirname is es modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKER_POOLS = 4;
const RESTART_TIMEOUT = 5000;

function runWorker(workerNumber: number) {
    console.log(`Starting worker ${workerNumber}...`);
    const worker = new Worker(path.resolve(__dirname, 'worker.js'));
    worker.on('error', (err: string) => console.error(err));
    worker.on('exit', (code: number) => {
        if (code !== 0) {
            console.error(`Worker ${workerNumber} stopped with exit code ${code}`);
        }
        setTimeout(() => {
            runWorker(workerNumber);
            console.log(`Restarting worker ${workerNumber}...`);
        }, RESTART_TIMEOUT)
    });
    console.log(`Worker ${workerNumber} started`);
}

for (let i = 0; i < WORKER_POOLS; i++) {
    runWorker(i);
}