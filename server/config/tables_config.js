import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
  process.env.USERS_TABLE_NAME = 'users_test';
  process.env.PROPERTIES_TABLE_NAME = 'properties_test';
} else {
  process.env.USERS_TABLE_NAME = 'users';
  process.env.PROPERTIES_TABLE_NAME = 'properties';
}
