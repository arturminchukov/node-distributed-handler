import * as console from "node:console";
import { Worker } from 'worker_threads';
import * as path from "node:path";
import { fileURLToPath } from 'url';

// A little trick to get __dirname is es modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WORKER_POOLS = 4;
const RESTART_TIMEOUT = 5000;

const closeTimeoutUnprocessedTaskWorkPath = 'closeTimeoutUnprocessedTaskWork.js';
const processingTaskWorkerPath  = 'worker.js';

function runWorker(workerNumber: number, workerPath: string) {
    console.log(`Starting worker ${workerNumber}...`);
    const worker = new Worker(path.resolve(__dirname, workerPath));
    worker.on('error', (err: string) => console.error(err));
    worker.on('exit', (code: number) => {
        if (code !== 0) {
            console.error(`Worker ${workerNumber} stopped with exit code ${code}`);
        }
        setTimeout(() => {
            runWorker(workerNumber, workerPath);
            console.log(`Restarting worker ${workerNumber}...`);
        }, RESTART_TIMEOUT)
    });
    console.log(`Worker ${workerNumber} started`);
}

for (let i = 0; i < WORKER_POOLS; i++) {
    runWorker(i, processingTaskWorkerPath);
}

/**
 * Запускаем воркер для перевода задач которые перевели в статус PROCESSING,
 * но воркер отвалился, закрываем их через определенный таймаут
 * */
runWorker(WORKER_POOLS, closeTimeoutUnprocessedTaskWorkPath);


