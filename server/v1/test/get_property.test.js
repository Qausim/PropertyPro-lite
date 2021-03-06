import { clearAllTestRecords } from '../helpers/test_hooks_helper';
import testConfig from '../config/test_config';

const { chai, expect, app } = testConfig;


export default () => {
  const propertyUrl = '/api/v1/property';
  const signupUrl = '/api/v1/auth/signup';

  // Test user object
  let agent = {
    email: 'qauzeem@example.com',
    first_name: 'Olawumi',
    last_name: 'Yusuff',
    password: '123456',
    phone_number: '08000000000',
    address: 'Iyana Ipaja, Lagos',
    is_agent: true,
  };
  let user = {
    email: 'user@example.com',
    first_name: 'Olawumi',
    last_name: 'Yusuff',
    password: '123456',
    phone_number: '08000000000',
    address: 'Iyana Ipaja, Lagos',
    is_agent: false,
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

        throw new Error('Could not insert property user');
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
  after(clearAllTestRecords);

  // Tests that are meant to pass
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
      expect(res.body.data).to.have.property('image_url');
      expect(res.body.data).to.have.property('created_on');
      expect(res.body.data).to.have.property('updated_on');
      expect(res.body.data).to.have.property('owner_name');
      expect(res.body.data).to.have.property('owner_email');
      expect(res.body.data).to.have.property('owner_phone_number');
      expect(res.body.data.id).to.equal(propertyEntry.id);
      expect(res.body.data.status).to.equal(propertyEntry.status);
      expect(res.body.data.type).to.equal(propertyEntry.type);
      expect(res.body.data.state).to.equal(propertyEntry.state);
      expect(res.body.data.city).to.equal(propertyEntry.city);
      expect(res.body.data.address).to.equal(propertyEntry.address);
      expect(res.body.data.price).to.equal(propertyEntry.price);
      expect(res.body.data.image_url).to.equal(propertyEntry.image_url);
      expect(res.body.data.owner_name).to.equal(`${agent.first_name} ${agent.last_name}`);
      expect(res.body.data.owner_email).to.equal(agent.email);
      expect(res.body.data.owner_phone_number).to.equal(agent.phone_number);
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
      expect(res.body.data).to.have.property('image_url');
      expect(res.body.data).to.have.property('created_on');
      expect(res.body.data).to.have.property('updated_on');
      expect(res.body.data).to.have.property('owner_name');
      expect(res.body.data).to.have.property('owner_email');
      expect(res.body.data).to.have.property('owner_phone_number');
      expect(res.body.data.id).to.equal(propertyEntry.id);
      expect(res.body.data.status).to.equal(propertyEntry.status);
      expect(res.body.data.type).to.equal(propertyEntry.type);
      expect(res.body.data.state).to.equal(propertyEntry.state);
      expect(res.body.data.city).to.equal(propertyEntry.city);
      expect(res.body.data.address).to.equal(propertyEntry.address);
      expect(res.body.data.price).to.equal(propertyEntry.price);
      expect(res.body.data.image_url).to.equal(propertyEntry.image_url);
      expect(res.body.data.owner_name).to.equal(`${agent.first_name} ${agent.last_name}`);
      expect(res.body.data.owner_email).to.equal(agent.email);
      expect(res.body.data.owner_phone_number).to.equal(agent.phone_number);
    });
  });

  // Tests that are meant to fail
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
      expect(res.body.error).to.equal('Unauthorized request');
    });

    it('should fail to get a non-existent property ad', async () => {
      const res = await chai.request(app)
        .get(`${propertyUrl}/9`)
        .set('Authorization', `Bearer ${user.token}`)
        .send();

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Not found');
    });

    it('should fail to get a property ad for an invalid property id', async () => {
      const res = await chai.request(app)
        .get(`${propertyUrl}/34jk`)
        .set('Authorization', `Bearer ${user.token}`)
        .send();

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid property id');
    });
  });
};
