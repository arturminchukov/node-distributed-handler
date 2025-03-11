import { taskRepository, ITaskRepository } from '@repositories';
import * as process from "node:process";
import { threadId } from "node:worker_threads";

const workerId = threadId;

type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
const TaskStatus = {
    NEW: 'NEW',
    PROCESSING: 'PROCESSING',
    DONE: 'DONE',
    ERROR: 'ERROR',
} as const;

class TaskService {
    private taskRepository: ITaskRepository;

    constructor({taskRepository}: { taskRepository: ITaskRepository }) {
        this.taskRepository = taskRepository;
    }

    async runNewTask() {
        try {
            const task = await this.taskRepository.getNewTask();
            if (!task) {
                return null;
            }

            console.log(`Worker ${workerId} took task ${task.id}`);
            const response = await fetch(task.url);
            const newTask = {
                status: response.statusText.toLowerCase() === 'ok' ? TaskStatus.DONE : TaskStatus.ERROR,
                http_code: response.status,
                url: task.url,
                id: task.id,
                updated_time: null
            }
            return this.taskRepository.updateTask(newTask);
        } catch (error) {
            console.error(error);
        }
    }

    async closeTimeoutTasks() {
        try {
            return await this.taskRepository.closeTimeoutTasks();
        } catch (error) {
            console.error(error);
        }
    }
}

export const taskService = new TaskService({taskRepository});