import { DataSource } from "typeorm";
import { Task } from "@entities";
import * as process from "node:process";

const POSTGRES_HOST = process.env.POSTGRES_HOST || "127.0.0.1";
const POSTGRES_USER = process.env.POSTGRES_USER;
if (!POSTGRES_USER) {
    throw new Error("POSTGRES_USER is required");
}

const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
if(!POSTGRES_PASSWORD) {
    throw new Error("POSTGRES_PASSWORD is required");
}

const POSTGRES_DATABASE_NAME = process.env.POSTGRES_DATABASE_NAME;
if (!POSTGRES_DATABASE_NAME) {
    throw new Error("POSTGRES_DATABASE_NAME is required");
}


export const PostgresSource = new DataSource({
    type: "postgres",
    host: POSTGRES_HOST,
    port: 5432,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE_NAME,
    entities: [Task],
    synchronize: true,
    logging: false,
})

export let isDatabaseInitialized = false;
// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap

PostgresSource.initialize()
    .then(() => {
        isDatabaseInitialized = true;
    })
    .catch((error) => console.log(error));
