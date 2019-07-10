if (process.env.NODE_ENV === 'test') {
  process.env.USERS_TABLE = 'users_test';
  process.env.PROPERTIES_TABLE = 'properties_test';
} else {
  process.env.USERS_TABLE = 'users';
  process.env.PROPERTIES_TABLE = 'properties';
}
