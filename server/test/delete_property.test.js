import testConfig from '../config/test_config';
import { clearAllTestRecords } from '../helpers/test_hooks_helper';


const { chai, expect, app } = testConfig;


export default () => {
  const propertyUrl = '/api/v1/property';
  const signupUrl = '/api/v1/auth/signup';

  // Test user objects
  let admin;
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
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PWD;
    chai.request(app).post('/api/v1/auth/signin').send({ email, password })
      .then((res) => {
        if (res.status === 200) {
          admin = res.body.data;
          return chai.request(app)
            .post(signupUrl)
            .send(agentOne);
        }
        throw new Error('Could not sign admin in');
      })
      .then((res) => {
        if (res.status === 201) {
          agentOne = res.body.data;
          return chai.request(app)
            .post(signupUrl)
            .send(agentTwo);
        }
        throw new Error('Could not sign agent one up');
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


  // Tests that are meant to pass
  describe('success', () => {
    it(' delete a property ad successfully', async () => {
      const res = await chai.request(app)
        .delete(`${propertyUrl}/${propertyEntries[0].id}`)
        .set('Authorization', `Bearer ${agentOne.token}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.property('message');
      expect(res.body.data.message).to.equal('Successfully deleted property ad');
    });


  });


  // Tests that are meant to fail
  describe('failure', () => {
    it('should fail to delete property ad for an unauthorized user', async () => {
      const res = await chai.request(app)
        .delete(`${propertyUrl}/${propertyEntries[0].id}`)
        .send();

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Unauthorized request');
    });

    it('should fail to delete property ad for a non-onwer agent', async () => {
      const res = await chai.request(app)
        .delete(`${propertyUrl}/${propertyEntries[1].id}`)
        .set('Authorization', `Bearer ${agentTwo.token}`)
        .send();

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Only an advert owner (agent) can delete it');
    });

    it('should fail to delete property ad for an ordinary user', async () => {
      const res = await chai.request(app)
        .delete(`${propertyUrl}/${propertyEntries[1].id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send();

      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Only an advert owner (agent) can delete it');
    });

    it('should fail to delete property ad with non-existing id', async () => {
      const res = await chai.request(app)
        .delete(`${propertyUrl}/9`)
        .set('Authorization', `Bearer ${agentOne.token}`)
        .send();

      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Not found');
    });

    it('should fail to delete property ad with an invalid', async () => {
      const res = await chai.request(app)
        .delete(`${propertyUrl}/ieufj67`)
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
