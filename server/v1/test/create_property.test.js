import testConfig from '../config/test_config';
import { clearAllTestRecords } from '../helpers/test_hooks_helper';


const { chai, expect, app } = testConfig;


export default () => {
  const propertyUrl = '/api/v1/property';
  const signupUrl = '/api/v1/auth/signup';

  // Test user objects
  let agent = {
    email: 'agent@example.com',
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

  // Sign up test user objects before tests run
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
          done();
        } else {
          throw new Error('Could not insert user');
        }
      })
      .catch(error => done(error));
  });

  // Clear db records after tests run
  after(clearAllTestRecords);

  // Tests that are meant to pass
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
        .attach('property_image', data.image);

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
      expect(res.body.data).to.have.property('created_on');
      expect(res.body.data).to.have.property('updated_on');
      expect(res.body.data).to.have.property('image_url');
      expect(res.body.data.status).to.equal('available');
      expect(res.body.data.type).to.equal(data.type);
      expect(res.body.data.state).to.equal(data.state);
      expect(res.body.data.city).to.equal(data.city);
      expect(res.body.data.price).to.equal(parseFloat(data.price.toFixed(2)));
      expect(res.body.data.image_url).to.not.equal('');
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
      expect(res.body.data).to.have.property('created_on');
      expect(res.body.data).to.have.property('updated_on');
      expect(res.body.data).to.have.property('image_url');
      expect(res.body.data.status).to.equal('available');
      expect(res.body.data.type).to.equal(data.type);
      expect(res.body.data.state).to.equal(data.state);
      expect(res.body.data.city).to.equal(data.city);
      expect(res.body.data.price).to.equal(parseFloat(data.price.toFixed(2)));
      expect(res.body.data.image_url).to.equal('');
    });
  });

  // Tests that are meant to fail
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
        expect(res.body.error).to.equal('Invalid, zero or empty price field');
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
        expect(res.body.error).to.equal('Invalid, zero or empty price field');
      });
  });
};
