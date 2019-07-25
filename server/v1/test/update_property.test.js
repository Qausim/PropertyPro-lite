import testConfig from '../config/test_config';
import { clearAllTestRecords } from '../helpers/test_hooks_helper';


const { chai, expect, app } = testConfig;

export default () => {
  const propertyUrl = '/api/v1/property';
  const signupUrl = '/api/v1/auth/signup';

  // Test user objects
  let agentOne = {
    email: 'qauzeem@example.com',
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
  ];

  // Sign up users and create property objects before tests
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
        throw new Error('Could not sign agent up');
      })
      .then((res) => {
        if (res.status === 201) {
          agentTwo = res.body.data;
          return chai.request(app)
            .post(signupUrl)
            .send(user);
        }
        throw new Error('Could not sign second agent up');
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
        throw new Error('Could not sign up user');
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
        throw new Error('Could not insert property item');
      })
      .then((res) => {
        if (res.status === 201) {
          propertyEntries[1] = res.body.data;
          done();
        } else {
          throw new Error('Could not insert property item');
        }
      })
      .catch(error => done(error));
  });

  // Clear records after
  after(clearAllTestRecords);

  describe('success', () => {
    it('should update property ad price successfully', async () => {
      const newPrice = 15000000;
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[0].id}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('price', newPrice);

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
      expect(res.body.data.price).to.equal(newPrice);
      expect(res.body.data.updated_on).to.not.equal(null);
    });

    it('should update property ad type successfully', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[0].id}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('type', '3 bedroom duplex');

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
      expect(res.body.data.type).to.equal('3 bedroom duplex');
      expect(res.body.data.updated_on).to.not.equal(null);
    });

    it('should update property ad state successfully', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[0].id}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('state', 'Oyo');

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
      expect(res.body.data.state).to.equal('Oyo');
      expect(res.body.data.updated_on).to.not.equal(null);
    });

    it('should update property ad city successfully', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[0].id}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('city', 'Ibadan');

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
      expect(res.body.data.city).to.equal('Ibadan');
      expect(res.body.data.updated_on).to.not.equal(null);
    });

    it('should update property address successfully', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[0].id}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('address', '13 Samonda Street');

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
      expect(res.body.data.address).to.equal('13 Samonda Street');
      expect(res.body.data.updated_on).to.not.equal(null);
    });
  });

  // Tests that are meant to fail
  describe('failure', () => {
    it('should fail to update property data for an unauthorized user',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .field('price', 15000000);

        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Unauthorized request');
      });


    it('should fail for an empty request body',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`);

        expect(res.status).to.equal(500);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Internal server error');
      });


    it('should fail to update property ad for a non owner agent',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentTwo.token}`)
          .field('price', 15000000);

        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Only an advert owner (agent) can edit it');
      });

    it('should fail to update property ad for a non agent',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${user.token}`)
          .field('price', 15000000);

        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Only an advert owner (agent) can edit it');
      });

    it('should fail to update property ad for a non existing ad',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/9`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('price', 15000000);

        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Not found');
      });

    it('should fail to update property ad for an invalid property id',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/9jdkd`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('price', 15000000);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid property id');
      });

    it('should fail to update property ad with a non-string type value',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Authorization', `Bearer ${agentOne.token}`)
          .send({ type: 33 });

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Type field must be a string value');
      });

    it('should fail to update property ad with empty type field',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('type', '');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Type field cannot be updated with an empty value');
      });

    it('should fail to update property ad with empty but spaced type field',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('type', '   ');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Type field cannot be updated with an empty value');
      });

    it('should fail to update property ad with all number type string',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('type', '33');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Type field cannot be all number');
      });

    it('should fail to update property ad with a non-string state value',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Authorization', `Bearer ${agentOne.token}`)
          .send({ state: 33 });

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('State field must be a string value');
      });

    it('should fail to update property ad with empty state string',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('state', '');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('State field cannot be updated with an empty value');
      });

    it('should fail to update property ad with empty but spaced state string',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('state', '  ');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('State field cannot be updated with an empty value');
      });

    it('should fail to update property ad with a state value containing a number',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('state', '99 Oyo');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('State field cannot contain a number');
      });

    it('should fail to update property ad with a non-string city value',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Authorization', `Bearer ${agentOne.token}`)
          .send({ city: 33 });

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('City field must be a string value');
      });

    it('should fail to update property ad with empty city string',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('city', '');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('City field cannot be updated with an empty value');
      });

    it('should fail to update property ad with empty but spaced city string',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('city', '  ');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('City field cannot be updated with an empty value');
      });

    it('should fail to update property ad with a city value containing a number',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('city', '99 Oyo');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('City field cannot contain a number');
      }); // *********************

    it('should fail to update property ad with a non-string address value',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Authorization', `Bearer ${agentOne.token}`)
          .send({ address: 33 });

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Address field must be a string value');
      });

    it('should fail to update property ad with empty address field',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('address', '');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Address field cannot be updated with an empty value');
      });

    it('should fail to update property ad with empty but spaced address field',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('address', '   ');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Address field cannot be updated with an empty value');
      });

    it('should fail to update property ad with all number address string',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('address', '33');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Address field cannot be all number');
      });

    it('should fail to update property ad with non-number price value',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('price', 'adf');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Price field must be a non-zero positive number');
      });

    it('should fail to update property ad with empty price', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[1].id}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('price', '');

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to
        .equal('Price field must be a non-zero positive number');
    });

    it('should fail to update property ad with zero price',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('price', 0);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Price field must be a non-zero positive number');
      });

    it('should fail to update property ad with negative price',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('price', -2220);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Price field must be a non-zero positive number');
      });

    it('should fail to update property id', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[1].id}`)
        .set('Content-Type', `Bearer ${agentOne.token}`)
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('id', 1);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to
        .equal('You cannot update property fields "id" and "owner"');
    });

    it('should fail to update property owner', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[1].id}`)
        .set('Content-Type', `Bearer ${agentOne.token}`)
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('owner', 2);

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to
        .equal('You cannot update property fields "id" and "owner"');
    });
  });
};
