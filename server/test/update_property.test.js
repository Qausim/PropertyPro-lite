import testConfig from '../config/test_config';
import { clearAllTestRecords } from '../helpers/test_hooks_helper';


const { chai, expect, app } = testConfig;

export default () => {
  const propertyUrl = '/api/v1/property';
  const signupUrl = '/api/v1/auth/signup';

  // Test user objects
  let agentOne = {
    email: 'qauzeem@example.com',
    firstName: 'Olawumi',
    lastName: 'Yusuff',
    password: '123456',
    phoneNumber: '08000000000',
    address: 'Iyana Ipaja, Lagos',
    isAdmin: false,
    isAgent: true,
  };

  let agentTwo = {
    email: 'agent.two@example.com',
    firstName: 'Bolu',
    lastName: 'Olujide',
    password: '123456',
    phoneNumber: '08000000000',
    address: 'Egbeda, Lagos',
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
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[0].id}`)
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('price', 15000000);

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
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.price).to.equal(15000000);
      expect(res.body.data.updatedOn).to.not.equal(null);
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
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.type).to.equal('3 bedroom duplex');
      expect(res.body.data.updatedOn).to.not.equal(null);
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
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.state).to.equal('Oyo');
      expect(res.body.data.updatedOn).to.not.equal(null);
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
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.city).to.equal('Ibadan');
      expect(res.body.data.updatedOn).to.not.equal(null);
    });

    it('should update property ad price successfully', async () => {
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
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updatedOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.address).to.equal('13 Samonda Street');
      expect(res.body.data.updatedOn).to.not.equal(null);
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

    it('should fail to update property ad with empty type', async () => {
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
      expect(res.body.error).to.equal('Type cannot be empty');
    });

    it('should fail to update property ad with empty state', async () => {
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
      expect(res.body.error).to.equal('State cannot be empty');
    });

    it('should fail to update property ad with invalid state field',
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
        expect(res.body.error).to.equal('Invalid state field');
      });

    it('should fail to update property ad with empty city', async () => {
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
      expect(res.body.error).to.equal('City cannot be empty');
    });

    it('should fail to update property ad with invalid city field',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('city', '99 Lagos');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid city field');
      });

    it('should fail to update property ad with empty address', async () => {
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
      expect(res.body.error).to.equal('Address cannot be empty');
    });

    it('should fail to update property ad with all number address field',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('address', '876776577');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid address field');
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
      expect(res.body.error).to.equal('Invalid price field');
    });

    it('should fail to update property ad with invalid price',
      async () => {
        const res = await chai.request(app)
          .patch(`${propertyUrl}/${propertyEntries[1].id}`)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agentOne.token}`)
          .field('price', '3928df');

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid price field');
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
        expect(res.body.error).to.equal('Invalid price field');
      });

    it('should fail to update property id', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[1].id}`)
        .set('Content-Type', `Bearer ${agentOne.token}`)
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('id', 1);

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal(
        'You cannot update fields "id" and "owner"',
      );
    });

    it('should fail to update property owner', async () => {
      const res = await chai.request(app)
        .patch(`${propertyUrl}/${propertyEntries[1].id}`)
        .set('Content-Type', `Bearer ${agentOne.token}`)
        .set('Authorization', `Bearer ${agentOne.token}`)
        .field('owner', 2);

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal(
        'You cannot update fields "id" and "owner"',
      );
    });
  });
};
