import bcrypt from 'bcrypt';

import dbConnection from './database';


const insertAdmin = async (usersTable) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PWD;
  const adminPhone = process.env.ADMIN_PHONE_NUMBER;
  const adminAddress = process.env.ADMIN_ADDRESS;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(adminPassword, 10, (error, hash) => {
      if (error) reject(error);
      resolve(hash);
    });
  });
  await dbConnection.dbConnect(`INSERT INTO ${usersTable} (email, password, first_name, last_name,
    is_admin, phone_number, address) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING;`,
  [adminEmail, hashedPassword, 'Olawumi', 'Yusuff', true, adminPhone, adminAddress]);
};

const userTableCreationQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(250) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
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
    password VARCHAR(250) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
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
    created_on VARCHAR(50) NOT NULL,
    updated_on VARCHAR(50),
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
    created_on VARCHAR(50) NOT NULL,
    updated_on VARCHAR(50),
    image_url VARCHAR(200),
    owner BIGINT REFERENCES users_test (id) NOT NULL
  );
`;

export default {
  async createTable() {
    await dbConnection.dbConnect(userTableCreationQuery);
    await dbConnection.dbConnect(propertyTableCreationQuery);
    await insertAdmin('users');
  },

  async createTestTables() {
    await dbConnection.dbConnect(userTestTableCreationQuery);
    await dbConnection.dbConnect(propertyTestTableCreationQuery);
    await insertAdmin('users_test');
  },
};
