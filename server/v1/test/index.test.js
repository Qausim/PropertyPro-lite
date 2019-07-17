import Migration from '../db/migration';
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
    .then(() => done())
    .catch(e => done(e));
});

// Tests for signup requests
describe('POST /auth/signup', signupTests);

// Tests for signin requests
describe('POST /auth/signin', signinTests);

// Tests for create property ad requests
describe('POST /property', createPropertyAdTests);

// Tests for get all properties requests
describe('GET /property', getAllPropertiesTests);

// Tests for get property by id requests
describe('GET /property/<:propertyId>', getPropertyByIdTests);

// Tests for marking a property ad as sold
describe('PATCH /property/<:propertyId>/sold', markPropertyAsSoldTests);

// // Tests for property list search
describe('GET /property?type=propertyType', queryPropertyTypeTests);

// Tests for property update
describe('PATCH /property/<:propertyId>', updatePropertyAdTests);

// // Tests for property delete
describe('DELETE /property/<:propertyId>', deletePropertyAdTests);
