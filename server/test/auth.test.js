import chai from 'chai';
import chaiHttp from 'chai-http';

import '../server';
import app from '../app';


const { expect } = chai;
chai.use(chaiHttp);

describe('POST /auth/signup', () => {
  describe('success', () => {
    it('should create a new user', async () => {
      const data = {
        email: 'qauzeem@example.com',
        firstName: 'Olawumi',
        lastName: 'Yusuff',
        phoneNumber: '08000000000',
        address: 'Iyana Ipaja, Lagos',
        password: '123456',
        isAdmin: true,
        isAgent: true,
      };

      const res = await chai.request(app)
        .post('/auth/signup')
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
  });


  describe('failure', () => {
    it('should fail to create a new user due to invalid email', async () => {
      const data = {
        email: 'qauzeem@example',
        firstName: 'Olawumi',
        lastName: 'Yusuff',
        phoneNumber: '08000000000',
        address: 'Iyana Ipaja, Lagos',
        password: '123456',
        isAdmin: true,
        isAgent: true,
      };

      const res = await chai.request(app)
        .post('/auth/signup')
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid email');
    });


    it('should fail to create a new user due to invalid password', async () => {
      const data = {
        email: 'qauzeem@example.com',
        firstName: 'Olawumi',
        lastName: 'Yusuff',
        phoneNumber: '08000000000',
        address: 'Iyana Ipaja, Lagos',
        password: '',
        isAdmin: true,
        isAgent: true,
      };

      const res = await chai.request(app)
        .post('/auth/signup')
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid password');
    });


    it('should fail to create a new user due to empty first name', async () => {
      const data = {
        email: 'qauzeem@example.com',
        firstName: '',
        lastName: 'Yusuff',
        phoneNumber: '08000000000',
        address: 'Iyana Ipaja, Lagos',
        password: '123456',
        isAdmin: true,
        isAgent: true,
      };

      const res = await chai.request(app)
        .post('/auth/signup')
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('First name is required');
    });


    it('should fail to create a new user due to empty last name', async () => {
      const data = {
        email: 'qauzeem@example.com',
        firstName: 'Olawumi',
        lastName: '',
        phoneNumber: '08000000000',
        address: 'Iyana Ipaja, Lagos',
        password: '123456',
        isAdmin: true,
        isAgent: true,
      };

      const res = await chai.request(app)
        .post('/auth/signup')
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Last name is required');
    });

    it('should fail to create a new user due to empty phone number for agents', async () => {
      const data = {
        email: 'qauzeem@example.com',
        firstName: 'Olawumi',
        lastName: 'Yusuff',
        phoneNumber: '',
        address: 'Iyana Ipaja, Lagos',
        password: '123456',
        isAdmin: true,
        isAgent: true,
      };

      const res = await chai.request(app)
        .post('/auth/signup')
        .send(data);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Phone number is required for agents');
    });

    it('should fail to create a new user due to empty address for agents', async () => {
      const data = {
        email: 'qauzeem@example.com',
        firstName: 'Olawumi',
        lastName: 'Yusuff',
        phoneNumber: '08000000000',
        address: '',
        password: '123456',
        isAdmin: false,
        isAgent: true,
      };

      const res = await chai.request(app)
        .post('/auth/signup')
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
