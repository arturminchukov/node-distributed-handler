UPDATE tasks
SET status = 'NEW', updated_time = NULL
WHERE id IN (
    SELECT id
    FROM tasks
    WHERE status = 'PROCESSING'
      AND updated_time < EXTRACT(EPOCH FROM NOW()) - 5*60
    ORDER BY id
    LIMIT 20
);