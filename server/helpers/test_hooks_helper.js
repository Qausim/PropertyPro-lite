import dbConnection from '../db/database';


export const clearAllTestRecords = (done) => {
  dbConnection.dbConnect('DELETE FROM properties_test;')
    .then(() => dbConnection.dbConnect('DELETE FROM users_test;'))
    .then(() => done())
    .catch(e => done(e));
};

export const clearTestUsersRecords = (done) => {
  dbConnection.dbConnect('DELETE FROM users_test;')
    .then(() => done())
    .catch(e => done(e));
};
