import { Task } from "@entities";
import { UpdateResult } from "typeorm";

export interface ITaskRepository {
    getNewTask(): Promise<Task | null>;
    updateTask(task: Task): Promise<number | undefined>
    closeTimeoutTasks(): Promise<number | undefined>
}