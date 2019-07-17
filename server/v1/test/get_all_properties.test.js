import testConfig from '../config/test_config';
import { clearAllTestRecords } from '../helpers/test_hooks_helper';


const { chai, expect, app } = testConfig;

export default () => {
  const propertyUrl = '/property';
  const signupUrl = '/auth/signup';

  // Test user objects
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
            .set('Authorization', `Bearer ${agent.token}`)
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

  // Clear all db records after tests run
  after(clearAllTestRecords);

  describe('success', () => {
    it('should get all properties ads', async () => {
      const res = await chai.request(app)
        .get(propertyUrl)
        .set('Authorization', `Bearer ${user.token}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('array');
      expect(res.body.data.length).to.equal(2);
      expect(res.body.data[0]).to.have.property('id');
      expect(res.body.data[0]).to.have.property('status');
      expect(res.body.data[0]).to.have.property('type');
      expect(res.body.data[0]).to.have.property('state');
      expect(res.body.data[0]).to.have.property('city');
      expect(res.body.data[0]).to.have.property('address');
      expect(res.body.data[0]).to.have.property('price');
      expect(res.body.data[0]).to.have.property('image_url');
      expect(res.body.data[0]).to.have.property('created_on');
      expect(res.body.data[0]).to.have.property('updated_on');
      expect(res.body.data[0]).to.have.property('owner_name');
      expect(res.body.data[0]).to.have.property('owner_email');
      expect(res.body.data[0]).to.have.property('owner_phone_number');
      expect(res.body.data[0]).to.have.property('owner_address');
      expect(res.body.data[0].id).to.equal(propertyEntries[0].id);
      expect(res.body.data[0].status).to.equal(propertyEntries[0].status);
      expect(res.body.data[0].type).to.equal(propertyEntries[0].type);
      expect(res.body.data[0].state).to.equal(propertyEntries[0].state);
      expect(res.body.data[0].city).to.equal(propertyEntries[0].city);
      expect(res.body.data[0].address).to.equal(propertyEntries[0].address);
      expect(res.body.data[0].price).to.equal(propertyEntries[0].price);
      expect(res.body.data[0].image_url).to.equal(propertyEntries[0].image_url);
      expect(res.body.data[0].owner_name).to.equal(`${agent.first_name} ${agent.last_name}`);
      expect(res.body.data[0].owner_email).to.equal(agent.email);
      expect(res.body.data[0].owner_phone_number).to.equal(agent.phone_number);
      expect(res.body.data[0].owner_address).to.equal(agent.address);
      expect(res.body.data[1]).to.have.property('id');
      expect(res.body.data[1]).to.have.property('status');
      expect(res.body.data[1]).to.have.property('type');
      expect(res.body.data[1]).to.have.property('state');
      expect(res.body.data[1]).to.have.property('city');
      expect(res.body.data[1]).to.have.property('address');
      expect(res.body.data[1]).to.have.property('price');
      expect(res.body.data[1]).to.have.property('image_url');
      expect(res.body.data[1]).to.have.property('created_on');
      expect(res.body.data[1]).to.have.property('updated_on');
      expect(res.body.data[1]).to.have.property('owner_name');
      expect(res.body.data[1]).to.have.property('owner_email');
      expect(res.body.data[1]).to.have.property('owner_phone_number');
      expect(res.body.data[1]).to.have.property('owner_address');
      expect(res.body.data[1].id).to.equal(propertyEntries[1].id);
      expect(res.body.data[1].status).to.equal(propertyEntries[1].status);
      expect(res.body.data[1].type).to.equal(propertyEntries[1].type);
      expect(res.body.data[1].state).to.equal(propertyEntries[1].state);
      expect(res.body.data[1].city).to.equal(propertyEntries[1].city);
      expect(res.body.data[1].address).to.equal(propertyEntries[1].address);
      expect(res.body.data[1].price).to.equal(propertyEntries[1].price);
      expect(res.body.data[1].image_url).to.equal(propertyEntries[1].image_url);
      expect(res.body.data[1].owner_name).to.equal(`${agent.first_name} ${agent.last_name}`);
      expect(res.body.data[1].owner_email).to.equal(agent.email);
      expect(res.body.data[1].owner_phone_number).to.equal(agent.phone_number);
      expect(res.body.data[1].owner_address).to.equal(agent.address);
    });
  });

  describe('failure', () => {
    it('should fail to get properties for an unauthorized user', async () => {
      const res = await chai.request(app)
        .get(propertyUrl)
        .send();
      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Unauthorized request');
    });
  });
};
