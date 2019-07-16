import dbConnection from '../db/database';
import testConfig from '../config/test_config';
import { clearAllTestRecords } from '../helpers/test_hooks_helper';


const { chai, expect, app } = testConfig;


export default () => {
  const propertyUrl = '/property';
  const signupUrl = '/auth/signup';

  // Test user objects
  let agentOne = {
    email: 'agent.one@example.com',
    first_name: 'Olawumi',
    last_name: 'Yusuff',
    password: '123456',
    phone_number: '08000000000',
    address: 'Iyana Ipaja, Lagos',
    is_agent: true,
  };

  let agentTwo = {
    email: 'agent.two@example.com',
    first_name: 'Bolu',
    last_name: 'Olujide',
    password: '123456',
    phone_number: '08000000000',
    address: 'Egbeda, Lagos',
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
  const propertyEntries = [
    {
      type: '3 bedroom',
      state: 'Lagos',
      city: 'Lagos',
      address: '22 Allen Avenue, Ikeja',
      price: 1000000.00,
    },
    {
      type: 'mini flat',
      state: 'Oyo',
      city: 'Ibadan',
      address: '11 Ologuneru Street, Samonda',
      price: 8000000.00,
    },
  ];

  // Sign up test user objects and post test property object
  // before tests run
  before((done) => {
    chai.request(app)
      .post(signupUrl)
      .send(agentOne)
      .then((res) => {
        if (res.status === 201) {
          agentOne = res.body.data;
          return chai.request(app)
            .post(signupUrl)
            .send(agentTwo);
        }
        throw new Error('Could not insert agent one');
      })
      .then((res) => {
        if (res.status === 201) {
          agentTwo = res.body.data;
          return chai.request(app)
            .post(signupUrl)
            .send(user);
        }
        throw new Error('Could not insert agent two');
      })
      .then((res) => {
        if (res.status === 201) {
          user = res.body.data;

          return chai.request(app)
            .post(propertyUrl)
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${agentOne.token}`)
            .field('type', propertyEntries[0].type)
            .field('state', propertyEntries[0].state)
            .field('city', propertyEntries[0].city)
            .field('address', propertyEntries[0].address)
            .field('price', propertyEntries[0].price);
        }

        throw new Error('Could not insert property ad');
      })
      .then((res) => {
        if (res.status === 201) {
          propertyEntries[0] = res.body.data;

          return chai.request(app)
            .post(propertyUrl)
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${agentOne.token}`)
            .field('type', propertyEntries[1].type)
            .field('state', propertyEntries[1].state)
            .field('city', propertyEntries[1].city)
            .field('address', propertyEntries[1].address)
            .field('price', propertyEntries[1].price);
        }
      })
      .then((res) => {
        if (res.status === 201) {
          propertyEntries[1] = res.body.data;
          done();
        } else {
          throw new Error('Could not insert property ad');
        }
      })
      .catch(error => done(error));
  });

  // Reset each property's status after each test
  afterEach((done) => {
    dbConnection.dbConnect("UPDATE properties_test SET status='available' WHERE id = $1",
      [propertyEntries[0].id])
      .then((res) => {
        if (res.rowCount) {
          return dbConnection.dbConnect("UPDATE properties_test SET status='available' WHERE id = $1",
            [propertyEntries[0].id]);
        }
        throw new Error('Could not reset property status');
      })
      .then((res) => {
        if (res.rowCount) {
          done();
        } else throw new Error('Could not reset property status');
      })
      .catch(e => done(e));
  });
  // Clear all db records after tests run
  after(clearAllTestRecords);


  describe('success', () => {
    it('should mark a property ad as sold for an owner agent', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[0].id}/sold`)
        .set('Authorization', `Bearer ${agentOne.token}`)
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
      expect(res.body.data).to.have.property('created_on');
      expect(res.body.data).to.have.property('updated_on');
      expect(res.body.data).to.have.property('image_url');
      expect(res.body.data.status).to.equal('sold');
      expect(res.body.data.type).to.equal(propertyEntries[0].type);
      expect(res.body.data.state).to.equal(propertyEntries[0].state);
      expect(res.body.data.city).to.equal(propertyEntries[0].city);
      expect(res.body.data.price).to.equal(propertyEntries[0].price);
      expect(res.body.data.image_url).to.equal(propertyEntries[0].image_url);
      expect(res.body.data.updated_on).to.not.equal(null);
    });
  });


  describe('failure', () => {
    it('should fail to mark a property as sold for a non authenticated user',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}/sold`)
          .send();

        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized request');
      });

    it('should fail to mark a property as sold for a non owner agent',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}/sold`)
          .set('Authorization', `Bearer ${agentTwo.token}`)
          .send();

        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Only an advert owner (agent) can edit it');
      });

    it('should fail to mark a property as sold for a non agent',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}/sold`)
          .set('Authorization', `Bearer ${user.token}`)
          .send();

        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Only an advert owner (agent) can edit it');
      });

    it('should fail to mark a property as sold for a non existing ad',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/9/sold`)
          .set('Authorization', `Bearer ${agentOne.token}`)
          .send();

        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Not found');
      });

    it('should fail to mark a property as sold for an invalid property id',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/9jdkd/sold`)
          .set('Authorization', `Bearer ${agentOne.token}`)
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
