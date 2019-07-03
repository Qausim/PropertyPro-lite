import app from '../app';

import properties from '../db/properties';
import users from '../db/users';
import testConfig from '../config/test_config';

const { chai, expect } = testConfig;


export default () => {
  const propertyUrl = '/api/v1/property';
  const signupUrl = '/api/v1/auth/signup';

  // Test user object
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

  // Test property objects
  let propertyEntry = {
    type: '3 bedroom',
    state: 'Lagos',
    city: 'Lagos',
    address: '22 Allen Avenue, Ikeja',
    price: 1000000.00,
  };

  // Sign up test user objects and post test property object
  // before tests run
  before((done) => {
    chai.request(app)
      .post(signupUrl)
      .send(agent)
      .then((res) => {
        if (res.status === 201) {
          agent = res.body.data;
          return chai.request(app)
            .post(signupUrl)
            .send(user);
        }
        throw new Error('Could not insert agent');
      })
      .then((res) => {
        if (res.status === 201) {
          user = res.body.data;

          return chai.request(app)
            .post(propertyUrl)
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${agent.token}`)
            .field('type', propertyEntry.type)
            .field('state', propertyEntry.state)
            .field('city', propertyEntry.city)
            .field('address', propertyEntry.address)
            .field('price', propertyEntry.price);
        }

        throw new Error('Could not insert property ad');
      })
      .then((res) => {
        if (res.status === 201) {
          propertyEntry = res.body.data;
          done();
        } else {
          throw new Error('Could not insert property ad');
        }
      })
      .catch(error => done(error));
  });

  // Clear all db records after tests run
  after((done) => {
    properties.splice(0);
    users.splice(0);
    done();
  });


  describe('success', () => {
    it('should get a property ad successfully by its id for an agent', async () => {
      const res = await chai.request(app)
        .get(`${propertyUrl}/${propertyEntry.id}`)
        .set('Authorization', `Bearer ${agent.token}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('status');
      expect(res.body.data).to.have.property('type');
      expect(res.body.data).to.have.property('state');
      expect(res.body.data).to.have.property('city');
      expect(res.body.data).to.have.property('address');
      expect(res.body.data).to.have.property('price');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('ownerName');
      expect(res.body.data).to.have.property('ownerEmail');
      expect(res.body.data).to.have.property('ownerPhoneNumber');
      expect(res.body.data.id).to.equal(propertyEntry.id);
      expect(res.body.data.status).to.equal(propertyEntry.status);
      expect(res.body.data.type).to.equal(propertyEntry.type);
      expect(res.body.data.state).to.equal(propertyEntry.state);
      expect(res.body.data.city).to.equal(propertyEntry.city);
      expect(res.body.data.address).to.equal(propertyEntry.address);
      expect(res.body.data.price).to.equal(propertyEntry.price);
      expect(res.body.data.imageUrl).to.equal(propertyEntry.imageUrl);
      expect(res.body.data.ownerName).to.equal(`${agent.firstName} ${agent.lastName}`);
      expect(res.body.data.ownerEmail).to.equal(agent.email);
      expect(res.body.data.ownerPhoneNumber).to.equal(agent.phoneNumber);
    });

    it('should get a property ad successfully by its id for a user', async () => {
      const res = await chai.request(app)
        .get(`${propertyUrl}/${propertyEntry.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('status');
      expect(res.body.data).to.have.property('type');
      expect(res.body.data).to.have.property('state');
      expect(res.body.data).to.have.property('city');
      expect(res.body.data).to.have.property('address');
      expect(res.body.data).to.have.property('price');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('ownerName');
      expect(res.body.data).to.have.property('ownerEmail');
      expect(res.body.data).to.have.property('ownerPhoneNumber');
      expect(res.body.data.id).to.equal(propertyEntry.id);
      expect(res.body.data.status).to.equal(propertyEntry.status);
      expect(res.body.data.type).to.equal(propertyEntry.type);
      expect(res.body.data.state).to.equal(propertyEntry.state);
      expect(res.body.data.city).to.equal(propertyEntry.city);
      expect(res.body.data.address).to.equal(propertyEntry.address);
      expect(res.body.data.price).to.equal(propertyEntry.price);
      expect(res.body.data.imageUrl).to.equal(propertyEntry.imageUrl);
      expect(res.body.data.ownerName).to.equal(`${agent.firstName} ${agent.lastName}`);
      expect(res.body.data.ownerEmail).to.equal(agent.email);
      expect(res.body.data.ownerPhoneNumber).to.equal(agent.phoneNumber);
    });
  });


  describe('failure', () => {
    it('should fail to get a property ad for a non authenticated user', async () => {
      const res = await chai.request(app)
        .get(`${propertyUrl}/${propertyEntry.id}`)
        .send();

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Unauthorized user');
    });

    it('should fail to get a non-existent property ad', async () => {
      const res = await chai.request(app)
        .get(`${propertyUrl}/9`)
        .send();

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Not found');
    });
  });
};
