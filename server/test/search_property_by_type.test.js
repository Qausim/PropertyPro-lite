import testConfig from '../config/test_config';
import properties from '../db/properties';
import users from '../db/users';

const { chai, expect, app } = testConfig;


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
  const propertyEntries = [
    {
      type: '3 bedroom apartment',
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
    {
      type: 'Mini flat',
      state: 'Lagos',
      city: 'Lagos',
      address: '12 Masha Street, Surulere',
      price: '10000000',
    },
    {
      type: '3 bedroom mansion',
      state: 'Rivers',
      city: 'Port Harcourt',
      address: '29 Amaechi Street',
      price: '25000000',
    },
  ];

  // Signup test user objects and post properties before tests
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
        throw new Error('Could sign agent up');
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
        throw new Error('Could not sign up user');
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
        throw new Error('Could not insert property item');
      })
      .then((res) => {
        if (res.status === 201) {
          propertyEntries[1] = res.body.data;
          return chai.request(app)
            .post(propertyUrl)
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${agent.token}`)
            .field('type', propertyEntries[2].type)
            .field('state', propertyEntries[2].state)
            .field('city', propertyEntries[2].city)
            .field('address', propertyEntries[2].address)
            .field('price', propertyEntries[2].price);
        }
        throw new Error('Could not insert property item');
      })
      .then((res) => {
        if (res.status === 201) {
          propertyEntries[2] = res.body.data;
          return chai.request(app)
            .post(propertyUrl)
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${agent.token}`)
            .field('type', propertyEntries[3].type)
            .field('state', propertyEntries[3].state)
            .field('city', propertyEntries[3].city)
            .field('address', propertyEntries[3].address)
            .field('price', propertyEntries[3].price);
        }
        throw new Error('Could not insert property item');
      })
      .then((res) => {
        if (res.status === 201) {
          propertyEntries[3] = res.body.data;
          done();
        } else {
          throw new Error('Could not insert property item');
        }
      })
      .catch(error => done(error));
  });

  after((done) => {
    properties.splice(0);
    users.splice(0);
    done();
  });

  describe('success', () => {
    it('should get properties of same type irrespective of case', async () => {
      const queryText = 'mini flat';
      const res = await chai.request(app)
        .get(`${propertyUrl}?type=${queryText}`)
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
      expect(res.body.data[0]).to.have.property('imageUrl');
      expect(res.body.data[0]).to.have.property('createdOn');
      expect(res.body.data[0]).to.have.property('updatedOn');
      expect(res.body.data[0]).to.have.property('ownerName');
      expect(res.body.data[0]).to.have.property('ownerEmail');
      expect(res.body.data[0]).to.have.property('ownerPhoneNumber');
      expect(res.body.data[0].id).to.equal(propertyEntries[1].id);
      expect(res.body.data[0].status).to.equal(propertyEntries[1].status);
      expect(res.body.data[0].type).to.equal(propertyEntries[1].type);
      expect(res.body.data[0].state).to.equal(propertyEntries[1].state);
      expect(res.body.data[0].city).to.equal(propertyEntries[1].city);
      expect(res.body.data[0].address).to.equal(propertyEntries[1].address);
      expect(res.body.data[0].price).to.equal(propertyEntries[1].price);
      expect(res.body.data[0].imageUrl).to.equal(propertyEntries[1].imageUrl);
      expect(res.body.data[0].ownerName).to.equal(`${agent.firstName} ${agent.lastName}`);
      expect(res.body.data[0].ownerEmail).to.equal(agent.email);
      expect(res.body.data[0].ownerPhoneNumber).to.equal(agent.phoneNumber);
      expect(res.body.data[1]).to.have.property('id');
      expect(res.body.data[1]).to.have.property('status');
      expect(res.body.data[1]).to.have.property('type');
      expect(res.body.data[1]).to.have.property('state');
      expect(res.body.data[1]).to.have.property('city');
      expect(res.body.data[1]).to.have.property('address');
      expect(res.body.data[1]).to.have.property('price');
      expect(res.body.data[1]).to.have.property('imageUrl');
      expect(res.body.data[1]).to.have.property('createdOn');
      expect(res.body.data[1]).to.have.property('updatedOn');
      expect(res.body.data[1]).to.have.property('ownerName');
      expect(res.body.data[1]).to.have.property('ownerEmail');
      expect(res.body.data[1]).to.have.property('ownerPhoneNumber');
      expect(res.body.data[1].id).to.equal(propertyEntries[2].id);
      expect(res.body.data[1].status).to.equal(propertyEntries[2].status);
      expect(res.body.data[1].type).to.equal(propertyEntries[2].type);
      expect(res.body.data[1].state).to.equal(propertyEntries[2].state);
      expect(res.body.data[1].city).to.equal(propertyEntries[2].city);
      expect(res.body.data[1].address).to.equal(propertyEntries[2].address);
      expect(res.body.data[1].price).to.equal(propertyEntries[2].price);
      expect(res.body.data[1].imageUrl).to.equal(propertyEntries[2].imageUrl);
      expect(res.body.data[1].ownerName).to.equal(`${agent.firstName} ${agent.lastName}`);
      expect(res.body.data[1].ownerEmail).to.equal(agent.email);
      expect(res.body.data[1].ownerPhoneNumber).to.equal(agent.phoneNumber);
    });

    it('should get properties having the query as a substring', async () => {
      const queryText = '3 bedroom';
      const res = await chai.request(app)
        .get(`${propertyUrl}?type=${queryText}`)
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
      expect(res.body.data[0]).to.have.property('imageUrl');
      expect(res.body.data[0]).to.have.property('createdOn');
      expect(res.body.data[0]).to.have.property('updatedOn');
      expect(res.body.data[0]).to.have.property('ownerName');
      expect(res.body.data[0]).to.have.property('ownerEmail');
      expect(res.body.data[0]).to.have.property('ownerPhoneNumber');
      expect(res.body.data[0].id).to.equal(propertyEntries[0].id);
      expect(res.body.data[0].status).to.equal(propertyEntries[0].status);
      expect(res.body.data[0].type).to.equal(propertyEntries[0].type);
      expect(res.body.data[0].state).to.equal(propertyEntries[0].state);
      expect(res.body.data[0].city).to.equal(propertyEntries[0].city);
      expect(res.body.data[0].address).to.equal(propertyEntries[0].address);
      expect(res.body.data[0].price).to.equal(propertyEntries[0].price);
      expect(res.body.data[0].imageUrl).to.equal(propertyEntries[0].imageUrl);
      expect(res.body.data[0].ownerName).to.equal(`${agent.firstName} ${agent.lastName}`);
      expect(res.body.data[0].ownerEmail).to.equal(agent.email);
      expect(res.body.data[0].ownerPhoneNumber).to.equal(agent.phoneNumber);
      expect(res.body.data[1]).to.have.property('id');
      expect(res.body.data[1]).to.have.property('status');
      expect(res.body.data[1]).to.have.property('type');
      expect(res.body.data[1]).to.have.property('state');
      expect(res.body.data[1]).to.have.property('city');
      expect(res.body.data[1]).to.have.property('address');
      expect(res.body.data[1]).to.have.property('price');
      expect(res.body.data[1]).to.have.property('imageUrl');
      expect(res.body.data[1]).to.have.property('createdOn');
      expect(res.body.data[1]).to.have.property('updatedOn');
      expect(res.body.data[1]).to.have.property('ownerName');
      expect(res.body.data[1]).to.have.property('ownerEmail');
      expect(res.body.data[1]).to.have.property('ownerPhoneNumber');
      expect(res.body.data[1].id).to.equal(propertyEntries[3].id);
      expect(res.body.data[1].status).to.equal(propertyEntries[3].status);
      expect(res.body.data[1].type).to.equal(propertyEntries[3].type);
      expect(res.body.data[1].state).to.equal(propertyEntries[3].state);
      expect(res.body.data[1].city).to.equal(propertyEntries[3].city);
      expect(res.body.data[1].address).to.equal(propertyEntries[3].address);
      expect(res.body.data[1].price).to.equal(propertyEntries[3].price);
      expect(res.body.data[1].imageUrl).to.equal(propertyEntries[3].imageUrl);
      expect(res.body.data[1].ownerName).to.equal(`${agent.firstName} ${agent.lastName}`);
      expect(res.body.data[1].ownerEmail).to.equal(agent.email);
      expect(res.body.data[1].ownerPhoneNumber).to.equal(agent.phoneNumber);
    });

    it('should get properties of same type irrespective of extra spaces in query', async () => {
      const queryText = '       mini flat         ';
      const res = await chai.request(app)
        .get(`${propertyUrl}?type=${queryText}`)
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
      expect(res.body.data[0]).to.have.property('imageUrl');
      expect(res.body.data[0]).to.have.property('createdOn');
      expect(res.body.data[0]).to.have.property('updatedOn');
      expect(res.body.data[0]).to.have.property('ownerName');
      expect(res.body.data[0]).to.have.property('ownerEmail');
      expect(res.body.data[0]).to.have.property('ownerPhoneNumber');
      expect(res.body.data[0].id).to.equal(propertyEntries[1].id);
      expect(res.body.data[0].status).to.equal(propertyEntries[1].status);
      expect(res.body.data[0].type).to.equal(propertyEntries[1].type);
      expect(res.body.data[0].state).to.equal(propertyEntries[1].state);
      expect(res.body.data[0].city).to.equal(propertyEntries[1].city);
      expect(res.body.data[0].address).to.equal(propertyEntries[1].address);
      expect(res.body.data[0].price).to.equal(propertyEntries[1].price);
      expect(res.body.data[0].imageUrl).to.equal(propertyEntries[1].imageUrl);
      expect(res.body.data[0].ownerName).to.equal(`${agent.firstName} ${agent.lastName}`);
      expect(res.body.data[0].ownerEmail).to.equal(agent.email);
      expect(res.body.data[0].ownerPhoneNumber).to.equal(agent.phoneNumber);
      expect(res.body.data[1]).to.have.property('id');
      expect(res.body.data[1]).to.have.property('status');
      expect(res.body.data[1]).to.have.property('type');
      expect(res.body.data[1]).to.have.property('state');
      expect(res.body.data[1]).to.have.property('city');
      expect(res.body.data[1]).to.have.property('address');
      expect(res.body.data[1]).to.have.property('price');
      expect(res.body.data[1]).to.have.property('imageUrl');
      expect(res.body.data[1]).to.have.property('createdOn');
      expect(res.body.data[1]).to.have.property('updatedOn');
      expect(res.body.data[1]).to.have.property('ownerName');
      expect(res.body.data[1]).to.have.property('ownerEmail');
      expect(res.body.data[1]).to.have.property('ownerPhoneNumber');
      expect(res.body.data[1].id).to.equal(propertyEntries[2].id);
      expect(res.body.data[1].status).to.equal(propertyEntries[2].status);
      expect(res.body.data[1].type).to.equal(propertyEntries[2].type);
      expect(res.body.data[1].state).to.equal(propertyEntries[2].state);
      expect(res.body.data[1].city).to.equal(propertyEntries[2].city);
      expect(res.body.data[1].address).to.equal(propertyEntries[2].address);
      expect(res.body.data[1].price).to.equal(propertyEntries[2].price);
      expect(res.body.data[1].imageUrl).to.equal(propertyEntries[2].imageUrl);
      expect(res.body.data[1].ownerName).to.equal(`${agent.firstName} ${agent.lastName}`);
      expect(res.body.data[1].ownerEmail).to.equal(agent.email);
      expect(res.body.data[1].ownerPhoneNumber).to.equal(agent.phoneNumber);
    });

    it('should get empty properties array when query text has no correlation',
      async () => {
        const queryText = '   stadium   ';
        const res = await chai.request(app)
          .get(`${propertyUrl}?type=${queryText}`)
          .set('Authorization', `Bearer ${user.token}`)
          .send();

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).to.equal(0);
      });
  });


  describe('failure', () => {
    it('should fail to get properties by search for unauthenticated user', async () => {
      const queryText = 'mini flat';
      const res = await chai.request(app)
        .get(`${propertyUrl}?type=${queryText}`)
        .send();

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Unauthorized request');
    });

    it('should fail to get any result for empty query field', async () => {
      const res = await chai.request(app)
        .get(`${propertyUrl}?type`)
        .set('Authorization', `Bearer ${user.token}`)
        .send();

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Empty query text');
    });
  });
};
