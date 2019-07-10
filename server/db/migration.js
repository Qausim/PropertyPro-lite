import dbConnection from './database';

const userTableCreationQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(250) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_agent BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(11),
    address VARCHAR(250)
  );
`;

const userTestTableCreationQuery = `
  CREATE TABLE IF NOT EXISTS users_test (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(250) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_agent BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(11),
    address VARCHAR(250)
  );
`;

const propertyTableCreationQuery = `
  CREATE TABLE IF NOT EXISTS properties (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    status VARCHAR(9) DEFAULT 'available',
    type VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address VARCHAR(250) NOT NULL,
    price NUMERIC(19, 2) NOT NULL,
    created_on VARCHAR(15) NOT NULL,
    updated_on VARCHAR(15),
    image_url VARCHAR(200),
    owner BIGINT REFERENCES users (id) NOT NULL
  );
`;

const propertyTestTableCreationQuery = `
  CREATE TABLE IF NOT EXISTS properties_test (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    status VARCHAR(9) DEFAULT 'available',
    type VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address VARCHAR(250) NOT NULL,
    price NUMERIC(19, 2) NOT NULL,
    created_on VARCHAR(15) NOT NULL,
    updated_on VARCHAR(15),
    image_url VARCHAR(200),
    owner BIGINT REFERENCES users_test (id) NOT NULL
  );
`;

export default {
  async createTable() {
    await dbConnection.dbConnect(userTableCreationQuery);
    await dbConnection.dbConnect(userTestTableCreationQuery);
    await dbConnection.dbConnect(propertyTableCreationQuery);
    await dbConnection.dbConnect(propertyTestTableCreationQuery);
  },
};
