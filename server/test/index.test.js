import signupTests from './signup.test';
import signinTests from './signin.test';
import postPropertyTests from './create_property.test';
import getAllPropertiesTests from './get_all_properties.test';
import getPropertyByIdTests from './get_property.test';
import markProperyAsSoldTests from './mark_sold.test';


// Tests for signup requests
describe('POST /api/v1/auth/signup', signupTests);

// Tests for signin requests
describe('POST /api/v1/auth/signin', signinTests);

// Tests for create property ad requests
describe('POST /api/v1/property', postPropertyTests);

// Tests for get all properties requests
describe('GET /api/v1/property', getAllPropertiesTests);

// Tests for get property by id requests
describe('GET /api/v1/property/<:propertyId>', getPropertyByIdTests);

// Tests for marking a property ad as sold
describe('PATCH /api/v1/property/<:propertyId>/sold', markProperyAsSoldTests);
