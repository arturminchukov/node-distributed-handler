import { taskRepository, ITaskRepository } from '@repositories';
import * as process from "node:process";

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

            console.log(`Worker ${process.pid} took task ${task.id}`);
            const response = await fetch(task.url);
            const newTask = {
                status: response.statusText.toLowerCase() === 'ok' ? TaskStatus.DONE: TaskStatus.ERROR,
                http_code: response.status,
                url: task.url,
                id: task.id,
            }
            return this.taskRepository.updateTask(newTask);
        } catch (error) {
            console.error(error);
        }
    }
}

export const taskService = new TaskService({taskRepository});