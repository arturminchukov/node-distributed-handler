# node-distributed-handler

## Требования
 - Postgresql - для установки 

`docker pull postgres`

`docker run -itd -e POSTGRES_USER=<USER> -e POSTGRES_PASSWORD=<PASSWORD> -p 5432:5432 -v /data:/var/lib/postgresql/data --name <CONTAINER_NAME> postgres`

`docker exec -it [container_name] psql -U [postgres_user]`

`create database <database_name>;`
 - node - v23.7.0