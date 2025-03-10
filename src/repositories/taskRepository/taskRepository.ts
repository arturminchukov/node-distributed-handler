import { postgres } from "@dataSources";
import { isTaskEntity, Task } from "@entities";
import { ITaskRepository } from "./ITaskRepository.js";
import { UpdateResult } from "typeorm";

const getNewTaskQuery = `
    WITH selected_task as (SELECT id, url, status
                           FROM tasks
                           WHERE STATUS = 'NEW'
                           ORDER BY id LIMIT 1
        FOR
    UPDATE SKIP LOCKED
        )
    UPDATE tasks
    SET STATUS = 'PROCESSING' FROM selected_task
    WHERE tasks.id =selected_task.id
        RETURNING tasks.id
        , tasks.url;
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
        const updateResult= await postgres.PostgresSource.getRepository('tasks').update(
            {id},
            restData
        );
        return updateResult.affected;
    }
}

export const taskRepository = new TaskRepository();