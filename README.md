# node-distributed-handler

## Требования
- node - v23.7.0
- npm - v10.9.2
- Postgresql

установка Postgresql через докер:

`docker pull postgres`

`docker run -itd -e POSTGRES_USER=<USER> -e POSTGRES_PASSWORD=<PASSWORD> -p 5432:5432 -v /data:/var/lib/postgresql/data --name <CONTAINER_NAME> postgres`




## Создание базы
1. `docker exec -it [container_name] psql -U [postgres_user]`
2. `create database <database_name>;`
3. создать таблицу
```sql
CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      url VARCHAR(255),
      status VARCHAR(20) DEFAULT 'NEW',
      http_code INTEGER DEFAULT NULL,
      updated_time BIGINT DEFAULT NULL
);
```
4. наполнить данными, пример тестовых данных
```sql
insert INTO tasks (url)
VALUES
    ('https://github.com'),
    ('https://google.com'),
    ('https://reddit.com'),
    ('https://vk.com'),
    ('https://mail.ru'),
    ('https://yandex.ru');
```

## Переменные окружения
1. создайте файл .env внутри `./node-distributed-handler`, пример:
```dotenv
POSTGRES_USER=root
POSTGRES_PASSWORD=12345
POSTGRES_DATABASE_NAME=node_test
POSTGRES_HOST=localhost
```

## Установка зависимостей и запуск
1. выполните `npm ci`
2. `npm run start`