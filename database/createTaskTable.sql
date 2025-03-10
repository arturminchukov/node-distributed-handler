CREATE TABLE tasks (
      id SERIAL PRIMARY KEY,
      url VARCHAR(255),
      status VARCHAR(20) DEFAULT 'NEW',
      http_code INTEGER DEFAULT NULL
);