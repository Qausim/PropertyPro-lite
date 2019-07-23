import testConfig from '../config/test_config';
import dbConnection from '../db/database';
import { clearTestUsersRecords } from '../helpers/test_hooks_helper';


const { chai, expect, app } = testConfig;
const signupUrl = '/api/v1/auth/signup';


export default () => {
  // Test user object
  let user = {
    email: 'qauzeem@propertyprolite.com',
    first_name: 'Olawumi',
    last_name: 'Yusuff',
    password: '123456',
    phone_number: '08000000000',
    address: 'Iyana Ipaja, Lagos',
    is_agent: false,
  };

  // Sign up test user before any test run
  before((done) => {
    chai.request(app)
      .post(signupUrl)
      .send(user)
      .then((res) => {
        if (res.status === 201) {
          user = res.body.data;
          done();
        } else {
          throw new Error('Could not insert user');
        }
      })
      .catch(error => done(error));
  });

  // Clear new entries into the db save the initial test object
  afterEach((done) => {
    dbConnection.dbConnect('DELETE FROM users_test WHERE id <> $1 AND email <> $2',
      [user.id, process.env.ADMIN_EMAIL])
      .then(() => done())
      .catch(e => done(e));
  });

  // Clear the db after
  after(clearTestUsersRecords);

  // Tests that are meant to pass
  describe('success', () => {
    it('should create a new agent', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Akin',
        last_name: 'Ige',
        phone_number: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data).to.have.property('first_name');
      expect(res.body.data).to.have.property('last_name');
      expect(res.body.data).to.have.property('phone_number');
      expect(res.body.data).to.have.property('address');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('is_admin');
      expect(res.body.data).to.have.property('is_agent');
      expect(res.body.data.email).to.equal(data.email);
      expect(res.body.data.first_name).to.equal(data.first_name);
      expect(res.body.data.last_name).to.equal(data.last_name);
      expect(res.body.data.phone_number).to.equal(data.phone_number);
      expect(res.body.data.address).to.equal(data.address);
      expect(res.body.data.is_agent).to.equal(data.is_agent);
    });


    it('should create a new user with no phone number nor address', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Akin',
        last_name: 'Ige',
        password: '123456',
        is_agent: false,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data).to.have.property('first_name');
      expect(res.body.data).to.have.property('last_name');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('is_admin');
      expect(res.body.data).to.have.property('is_agent');
      expect(res.body.data.email).to.equal(data.email);
      expect(res.body.data.first_name).to.equal(data.first_name);
      expect(res.body.data.last_name).to.equal(data.last_name);
      expect(res.body.data.is_agent).to.equal(data.is_agent);
    });


    it('should create a new user with hyphenated first name', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Bolaji-Esan',
        last_name: 'Ige',
        password: '123456',
        is_agent: false,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data).to.have.property('first_name');
      expect(res.body.data).to.have.property('last_name');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('is_admin');
      expect(res.body.data).to.have.property('is_agent');
      expect(res.body.data.email).to.equal(data.email);
      expect(res.body.data.first_name).to.equal(data.first_name);
      expect(res.body.data.last_name).to.equal(data.last_name);
      expect(res.body.data.is_agent).to.equal(data.is_agent);
    });


    it('should create a new user with hyphenated last name', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Akin',
        last_name: 'Bolaji-Esan',
        password: '123456',
        is_agent: false,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data).to.have.property('first_name');
      expect(res.body.data).to.have.property('last_name');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('is_admin');
      expect(res.body.data).to.have.property('is_agent');
      expect(res.body.data.email).to.equal(data.email);
      expect(res.body.data.first_name).to.equal(data.first_name);
      expect(res.body.data.last_name).to.equal(data.last_name);
      expect(res.body.data.is_agent).to.equal(data.is_agent);
    });
  });


  // Tests that are meant to fail
  describe('failure', () => {
    it('should fail to create a new user with duplicate email', async () => {
      const data = {
        email: 'qauzeem@propertyprolite.com',
        first_name: 'Akin',
        last_name: 'Ige',
        phone_number: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(409);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Email address is taken');
    });


    it('should fail to create a new user with invalid email', async () => {
      const data = {
        email: 'akin.i@example',
        first_name: 'Akin',
        last_name: 'Ige',
        phone_number: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid email');
    });


    it('should fail to create a new user due with invalid password', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Akin',
        last_name: 'Ige',
        phone_number: '08000000000',
        address: 'Dopemu, Lagos',
        password: '',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid password');
    });


    it('should fail to create a new user with empty first name', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: '',
        last_name: 'Ige',
        phone_number: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('First name is required');
    });


    it('should fail to create a new user due to special character in first name', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Olajide--Esan',
        last_name: 'Ige',
        phone_number: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid special character combination in first name');
    });


    it('should fail to create a new user with empty last name', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Akin',
        last_name: '',
        phone_number: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Last name is required');
    });


    it('should fail to create a new user due to special character in last name', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Seyi',
        last_name: 'Olajide--Esan',
        phone_number: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid special character combination in last name');
    });


    it('should fail to create a new agent with empty phone number', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Akin',
        last_name: 'Ige',
        phone_number: '',
        address: 'Dopemu, Lagos',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Phone number is required for agents');
    });


    it('should fail to create a new agent with empty address', async () => {
      const data = {
        email: 'akin.i@example.com',
        first_name: 'Akin',
        last_name: 'Ige',
        phone_number: '08000000000',
        address: '',
        password: '123456',
        is_agent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Address is required for agents');
    });
  });
};
