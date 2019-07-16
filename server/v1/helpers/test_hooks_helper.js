import dbConnection from '../db/database';


/**
 * Cleans up the test users table preventing it from being littered as
 * well ensuring consistent behaviour between tests
 * @param {callback} done
 */
export const clearAllTestRecords = (done) => {
  dbConnection.dbConnect('DELETE FROM properties_test;')
    .then(() => dbConnection.dbConnect('DELETE FROM users_test WHERE email <> $1;', [process.env.ADMIN_EMAIL]))
    .then(() => done())
    .catch(e => done(e));
};

/**
 * Cleans up the test users and properties tables preventing it from being littered as
 * well ensuring consistent behaviour between tests
 * @param {callback} done
 */
export const clearTestUsersRecords = (done) => {
  dbConnection.dbConnect('DELETE FROM users_test WHERE email <> $1;', [process.env.ADMIN_EMAIL])
    .then(() => done())
    .catch(e => done(e));
};
