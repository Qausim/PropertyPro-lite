import fs from 'fs';

import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';
import users from '../db/users';
import properties from '../db/properties';

const signupUrl = '/api/v1/auth/signup';

// Test user objects
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

let agent = {
  email: 'qauzeem@example.com',
  firstName: 'Olawumi',
  lastName: 'Yusuff',
  password: '123456',
  phoneNumber: '08000000000',
  address: 'Iyana Ipaja, Lagos',
  isAdmin: false,
  isAgent: true,
};

let user = {
  email: 'user@example.com',
  firstName: 'Olawumi',
  lastName: 'Yusuff',
  password: '123456',
  phoneNumber: '08000000000',
  address: 'Iyana Ipaja, Lagos',
  isAdmin: false,
  isAgent: false,
};

// Sign up each of our user objects in the before hook
before((done) => {
  chai.request(app)
    .post(signupUrl)
    .send(admin)
    .then((res) => {
      if (res.status === 201) {
        admin = res.body.data;
        return chai.request(app)
          .post(signupUrl)
          .send(agent);
      } else {
        throw new Error('Could not insert admin');
      }
    })
    .then((res) => {
      if (res.status === 201) {
        agent = res.body.data;
        return chai.request(app)
          .post(signupUrl)
          .send(user);
      } else {
        throw new Error('Could not insert agent');
      }
    })
    .then((res) => {
      if (res.status === 201) {
        user = res.body.data;
        done();
      }
    })
    .catch(error => done(error));
});

// Clear user object inserted in each unit test after it
beforeEach((done) => {
  users.splice(3);
  done();
});

// After everything clear the records
after((done) => {
  users.splice(0);
  properties.splice(0);
  done();
});

const { expect } = chai;
chai.use(chaiHttp);


// Tests for signup requests
describe('POST /api/v1/auth/signup', () => {
  // Tests that are meant to pass
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


  // Tests that are meant to fail
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


// Tests for signin requests
describe('POST /api/v1/auth/signin', () => {
  const signinUrl = '/api/v1/auth/signin';

  // Tests that are meant to pass
  describe('success', () => {
    it('should log in a user successfully', async () => {
      const { email } = admin;
      const password = '123456';

      const res = await chai.request(app)
        .post(signinUrl)
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


  // Tests that are meant to fail
  describe('failure', () => {
    it('should fail to log in a user with incorrect email', async () => {
      const data = {
        email: 'ola@propertyprolite.com',
        password: '123456',
      };

      const res = await chai.request(app)
        .post(signinUrl)
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
        .post(signinUrl)
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
        .post(signinUrl)
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


describe('POST /api/v1/property', async () => {
  const propertyUrl = '/api/v1/property';
  describe('success', () => {
    const splittedDir = __dirname.replace(/[\\]/g, '/').split('/');
    const projectDir = splittedDir.slice(0, splittedDir.length - 2).join('/');
    const image = `${projectDir}/UI/images/propertya1.jpg`;
    
    it('should create a property ad with an image', async () => {
      const data = {
        type: '3 bedroom',
        state: 'Lagos',
        city: 'Lagos',
        address: '22 Allen Avenue, Ikeja',
        price: 1000000.00,
        image,
      };

      const res = await chai.request(app)
        .post(propertyUrl)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agent.token}`)
        .field('type', data.type)
        .field('state', data.state)
        .field('city', data.city)
        .field('address', data.address)
        .field('price', data.price)
        .attach('propertyImage', data.image);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('status');
      expect(res.body.data).to.have.property('type');
      expect(res.body.data).to.have.property('state');
      expect(res.body.data).to.have.property('city');
      expect(res.body.data).to.have.property('address');
      expect(res.body.data).to.have.property('price');
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.status).to.equal('available');
      expect(res.body.data.type).to.equal(data.type);
      expect(res.body.data.state).to.equal(data.state);
      expect(res.body.data.city).to.equal(data.city);
      expect(res.body.data.price).to.equal(data.price);
      expect(res.body.data.imageUrl).to.not.equal('');
    });

    it('should create a property ad without an image', async () => {
      const data = {
        type: '3 bedroom',
        state: 'Lagos',
        city: 'Lagos',
        address: '22 Allen Avenue, Ikeja',
        price: 1000000.00,
      };

      const res = await chai.request(app)
        .post(propertyUrl)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agent.token}`)
        .field('type', data.type)
        .field('state', data.state)
        .field('city', data.city)
        .field('address', data.address)
        .field('price', data.price);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('status');
      expect(res.body.data).to.have.property('type');
      expect(res.body.data).to.have.property('state');
      expect(res.body.data).to.have.property('city');
      expect(res.body.data).to.have.property('address');
      expect(res.body.data).to.have.property('price');
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.status).to.equal('available');
      expect(res.body.data.type).to.equal(data.type);
      expect(res.body.data.state).to.equal(data.state);
      expect(res.body.data.city).to.equal(data.city);
      expect(res.body.data.price).to.equal(data.price);
    });
  });

  describe('failure', () => {
    it('should fail to create a new property ad for non-agents', async () => {
      const data = {
        type: '3 bedroom',
        state: 'Lagos',
        city: 'Lagos',
        address: '22 Allen Avenue, Ikeja',
        price: 1000000.00,
      };

      const res = await chai.request(app)
        .post(propertyUrl)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${user.token}`)
        .field('type', data.type)
        .field('state', data.state)
        .field('city', data.city)
        .field('address', data.address)
        .field('price', data.price);
      
      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Only agents can create property ads');
    });

    it('should fail to create a new property ad for unauthorized request',
      async () => {
        const data = {
          type: '3 bedroom',
          state: 'Lagos',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .field('type', data.type)
          .field('state', data.state)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized request');
      });

    it('should fail to create a new property ad due to empty state field',
      async () => {
        const data = {
          state: '',
          type: '3 bedroom',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('State is required');
      });

    it('should fail to create a new property ad due to invalid state field',
      async () => {
        const data = {
          state: '119922adfad',
          type: '3 bedroom',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid state field');
      });

    it('should fail to create a new property ad due to empty city field',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: '',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('City is required');
      });

    it('should fail to create a new property ad due to invalid city field',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: '354564353ddfaf',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid city field');
      });

    it('should fail to create a new property ad due to empty address field',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          address: '',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Address is required');
      });

    it('should fail to create a new property ad due to invalid address field',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          address: '84848484',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid address field');
      });

    it('should fail to create a new property ad due to invalid or empty price',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: '',
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid price field');
      });

    it('should fail to create a new property ad due to zero price',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 0,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid price field');
      });
  });
});
