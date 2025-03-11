import { postgres } from "@dataSources";
import { isTaskEntity, Task } from "@entities";
import { ITaskRepository } from "./ITaskRepository.js";
import { UpdateResult } from "typeorm";

const getNewTaskQuery = `
    WITH selected_task AS (SELECT id, url, status
                           FROM tasks
                           WHERE status = 'NEW'
                           ORDER BY id
        LIMIT 1
        FOR
    UPDATE SKIP LOCKED
        )
    UPDATE tasks
    SET status       = 'PROCESSING',
        updated_time = EXTRACT(EPOCH FROM NOW()) -- Устанавливаем Unix Timestamp
        FROM selected_task
    WHERE tasks.id = selected_task.id
        RETURNING tasks.id
        , tasks.url;
`

const closeTimeoutTaskQuery = (timeoutS: number = 60, limit: number = 50) => `
    UPDATE tasks
    SET status       = 'NEW',
        updated_time = NULL
    WHERE id IN (SELECT id
                 FROM tasks
                 WHERE status = 'PROCESSING'
                   AND updated_time < EXTRACT(EPOCH FROM NOW()) - ${timeoutS}
                 ORDER BY id
        LIMIT ${limit}
        );
`

class TaskRepository implements ITaskRepository {
    async getNewTask() {
        const [[task]] = await postgres.PostgresSource.query(getNewTaskQuery);
        if (!task || !isTaskEntity(task)) {
            return null
        }
        return task;
    }

    async updateTask({id, ...restData}: Task) {
        const updateResult = await postgres.PostgresSource.getRepository('tasks').update(
            {id},
            restData
        );
        return updateResult.affected;
    }

    async closeTimeoutTasks() {
        const updateResult = await postgres.PostgresSource.query(closeTimeoutTaskQuery());
        return updateResult.affected;
    }

}

export const taskRepository = new TaskRepository();