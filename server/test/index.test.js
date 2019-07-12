import Migration from '../db/migration';
import dbConnection from '../db/database';
import signupTests from './signup.test';
import signinTests from './signin.test';
import createPropertyAdTests from './create_property.test';
import getAllPropertiesTests from './get_all_properties.test';
import getPropertyByIdTests from './get_property.test';
import markPropertyAsSoldTests from './mark_sold.test';
import queryPropertyTypeTests from './search_property_by_type.test';
import updatePropertyAdTests from './update_property.test';
import deletePropertyAdTests from './delete_property.test';


before((done) => {
  Migration.createTestTables()
    .then(() => {
      return dbConnection.dbConnect('ALTER SEQUENCE users_test_id_seq RESTART WITH 1;');
    })
    .then(() => dbConnection.dbConnect('ALTER SEQUENCE properties_test_id_seq RESTART WITH 1;'))
    .then(() => done())
    .catch(e => done(e));
});

// Tests for signup requests
describe('POST /api/v1/auth/signup', signupTests);

// Tests for signin requests
describe('POST /api/v1/auth/signin', signinTests);

// Tests for create property ad requests
describe('POST /api/v1/property', createPropertyAdTests);

// Tests for get all properties requests
describe('GET /api/v1/property', getAllPropertiesTests);

// Tests for get property by id requests
describe('GET /api/v1/property/<:propertyId>', getPropertyByIdTests);

// // Tests for marking a property ad as sold
// describe('PATCH /api/v1/property/<:propertyId>/sold', markPropertyAsSoldTests);

// // Tests for property list search
describe('GET /api/v1/property?type=propertyType', queryPropertyTypeTests);

// // Tests for property update
// describe('PATCH /api/v1/property/<:propertyId>', updatePropertyAdTests);

// // Tests for property delete
// describe('DELETE /api/v1/property/<:propertyId>', deletePropertyAdTests);
