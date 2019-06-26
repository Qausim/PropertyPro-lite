import chai from 'chai';
import chaiHttp from 'chai-http';

import '../server';
import app from '../app';
import users from '../db/users';

const signupUrl = '/api/v1/auth/signup';

let admin = {
  email: 'qauzeem@propertyprolite.com',
  firstName: 'Olawumi',
  lastName: 'Yusuff',
  password: '123456',
  phoneNumber: '08000000000',
  address: 'Iyana Ipaja, Lagos',
  isAdmin: true,
  isAgent: false,
};

before((done) => {
  chai.request(app)
    .post(signupUrl)
    .send(admin)
    .then((res) => {
      if (res.status === 201) {
        admin = res.body.data;
        done();
      } else {
        throw new Error('Could not insert admin');
      }
    })
    .catch(error => done(error));
});

beforeEach(() => {
  users.splice(1);
});

const { expect } = chai;
chai.use(chaiHttp);


describe('POST /api/v1/auth/signup', () => {
  describe('success', () => {
    it('should create a new agent', async () => {
      const data = {
        email: 'akin.i@example.com',
        firstName: 'Akin',
        lastName: 'Ige',
        phoneNumber: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        isAdmin: false,
        isAgent: true,
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
      expect(res.body.data).to.have.property('firstName');
      expect(res.body.data).to.have.property('lastName');
      expect(res.body.data).to.have.property('phoneNumber');
      expect(res.body.data).to.have.property('address');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('isAdmin');
      expect(res.body.data).to.have.property('isAgent');
      expect(res.body.data.email).to.equal(data.email);
      expect(res.body.data.firstName).to.equal(data.firstName);
      expect(res.body.data.lastName).to.equal(data.lastName);
      expect(res.body.data.phoneNumber).to.equal(data.phoneNumber);
      expect(res.body.data.address).to.equal(data.address);
      expect(res.body.data.isAdmin).to.equal(data.isAdmin);
      expect(res.body.data.isAgent).to.equal(data.isAgent);
    });


    it('should create a new user with no phone number nor address', async () => {
      const data = {
        email: 'akin.i@example.com',
        firstName: 'Akin',
        lastName: 'Ige',
        password: '123456',
        isAdmin: false,
        isAgent: false,
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
      expect(res.body.data).to.have.property('firstName');
      expect(res.body.data).to.have.property('lastName');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('isAdmin');
      expect(res.body.data).to.have.property('isAgent');
      expect(res.body.data.email).to.equal(data.email);
      expect(res.body.data.firstName).to.equal(data.firstName);
      expect(res.body.data.lastName).to.equal(data.lastName);
      expect(res.body.data.isAdmin).to.equal(data.isAdmin);
      expect(res.body.data.isAgent).to.equal(data.isAgent);
    });
  });


  describe('failure', () => {
    it('should fail to create a new user with duplicate email', async () => {
      const data = {
        email: 'qauzeem@propertyprolite.com',
        firstName: 'Akin',
        lastName: 'Ige',
        phoneNumber: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        isAdmin: false,
        isAgent: true,
      };

      const res = await chai.request(app)
        .post(signupUrl)
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Email address is taken');
    });


    it('should fail to create a new user with invalid email', async () => {
      const data = {
        email: 'akin.i@example',
        firstName: 'Akin',
        lastName: 'Ige',
        phoneNumber: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        isAdmin: false,
        isAgent: true,
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
        firstName: 'Akin',
        lastName: 'Ige',
        phoneNumber: '08000000000',
        address: 'Dopemu, Lagos',
        password: '',
        isAdmin: false,
        isAgent: true,
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
        firstName: '',
        lastName: 'Ige',
        phoneNumber: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        isAdmin: false,
        isAgent: true,
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


    it('should fail to create a new user with empty last name', async () => {
      const data = {
        email: 'akin.i@example.com',
        firstName: 'Akin',
        lastName: '',
        phoneNumber: '08000000000',
        address: 'Dopemu, Lagos',
        password: '123456',
        isAdmin: false,
        isAgent: true,
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


    it('should fail to create a new agent with empty phone number', async () => {
      const data = {
        email: 'akin.i@example.com',
        firstName: 'Akin',
        lastName: 'Ige',
        phoneNumber: '',
        address: 'Dopemu, Lagos',
        password: '123456',
        isAdmin: false,
        isAgent: true,
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
        firstName: 'Akin',
        lastName: 'Ige',
        phoneNumber: '08000000000',
        address: '',
        password: '123456',
        isAdmin: false,
        isAgent: true,
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
});


describe('POST /api/v1/auth/login', () => {
  const loginUrl = '/api/v1/auth/login';

  describe('success', () => {
    it('should log in a user successfully', async () => {
      const { email } = admin;
      const password = '123456';

      const res = await chai.request(app)
        .post(loginUrl)
        .send({ email, password });

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data).to.have.property('firstName');
      expect(res.body.data).to.have.property('lastName');
      expect(res.body.data).to.have.property('phoneNumber');
      expect(res.body.data).to.have.property('address');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('isAdmin');
      expect(res.body.data).to.have.property('isAgent');
      expect(res.body.data.id).to.equal(admin.id);
      expect(res.body.data.email).to.equal(admin.email);
      expect(res.body.data.firstName).to.equal(admin.firstName);
      expect(res.body.data.lastName).to.equal(admin.lastName);
      expect(res.body.data.phoneNumber).to.equal(admin.phoneNumber);
      expect(res.body.data.address).to.equal(admin.address);
      expect(res.body.data.isAdmin).to.equal(admin.isAdmin);
      expect(res.body.data.isAgent).to.equal(admin.isAgent);
    });
  });


  describe('failure', () => {
    it('should fail to log in a user with incorrect email', async () => {
      const data = {
        email: 'ola@propertyprolite.com',
        password: '123456',
      };

      const res = await chai.request(app)
        .post(loginUrl)
        .send(data);

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid email or password');
    });

    it('should fail to log in a user with invalid email format', async () => {
      const data = {
        email: 'qauzeem@propertyprolite',
        password: '123456',
      };

      const res = await chai.request(app)
        .post(loginUrl)
        .send(data);

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid email or password');
    });

    it('should fail to log in a user with incorrect password', async () => {
      const data = {
        email: admin.email,
        password: 'abcdefg',
      };

      const res = await chai.request(app)
        .post(loginUrl)
        .send(data);

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid email or password');
    });
  });
});
