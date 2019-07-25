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
    const projectDir = splittedDir.slice(0, splittedDir.length - 3).join('/');
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
        .field('price', data.price);
        // .attach('image_url', data.image);

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
      // expect(res.body.data.image_url).to.not.equal('');
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
    it('should fail to create a new property ad for an ordinary user', async () => {
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

    it('should fail to create a new property ad due to no type field supplied',
      async () => {
        const data = {
          state: 'Lagos',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Type field is required');
      });

    it('should fail to create a new property ad due to empty type string',
      async () => {
        const data = {
          type: '',
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

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Type field is required');
      });

    it('should fail to create a new property ad due to non-string type',
      async () => {
        const data = {
          type: 1,
          state: 'Lagos',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Authorization', `Bearer ${agent.token}`)
          .send(data);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Type field must be a string');
      });

    it('should fail to create a new property ad due to no all number type string',
      async () => {
        const data = {
          type: '222',
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

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Type field cannot be all number');
      });

    it('should fail to create a new property ad due to no state field supplied',
      async () => {
        const data = {
          type: '3 bedroom',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('State field is required');
      });

    it('should fail to create a new property ad due to empty state string',
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
        expect(res.body.error).to.equal('State field is required');
      });

    it('should fail to create a new property ad due to non-string state field',
      async () => {
        const data = {
          state: 33,
          type: '3 bedroom',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Authorization', `Bearer ${agent.token}`)
          .send(data);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('State field must be a string and must not contain a number');
      });

    it('should fail to create a new property ad due to a state string containing a number',
      async () => {
        const data = {
          type: '3 bedroom',
          state: 'Lagos33',
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

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('State field must be a string and must not contain a number');
      });

    it('should fail to create a new property ad due to no city field supplied',
      async () => {
        const data = {
          type: '3 bedroom',
          state: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('type', data.type)
          .field('state', data.state)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('City field is required');
      });

    it('should fail to create a new property ad due to empty city string',
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
        expect(res.body.error).to.equal('City field is required');
      });

    it('should fail to create a new property ad due to non-string city field',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 33,
          address: '22 Allen Avenue, Ikeja',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Authorization', `Bearer ${agent.token}`)
          .send(data);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('City field must be a string and must not contain a number');
      });

    it('should fail to create a new property ad due to a city string containing a number',
      async () => {
        const data = {
          type: '3 bedroom',
          state: 'Lagos',
          city: 'Lagos34',
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

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('City field must be a string and must not contain a number');
      });

    it('should fail to create a new property ad due to no address field supplied',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Address field is required');
      });

    it('should fail to create a new property ad due to empty address string',
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
        expect(res.body.error).to.equal('Address field is required');
      });

    it('should fail to create a new property ad due to non-string address',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          address: 33,
          price: 1000000.00,
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Authorization', `Bearer ${agent.token}`)
          .send(data);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Address field must be a string and must not be all number');
      });

    it('should fail to create a new property ad due to all number address string',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          address: '9099',
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
        expect(res.body.error).to
          .equal('Address field must be a string and must not be all number');
      });

    it('should fail to create a new property ad due to price field not supplied',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
        };

        const res = await chai.request(app)
          .post(propertyUrl)
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${agent.token}`)
          .field('state', data.state)
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to
          .equal('Price field is required and must be a number above zero');
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
        expect(res.body.error).to
          .equal('Price field is required and must be a number above zero');
      });

    it('it should fail to create a new property ad due to a non-number price string',
      async () => {
        const data = {
          state: 'Lagos',
          type: '3 bedroom',
          city: 'Lagos',
          address: '22 Allen Avenue, Ikeja',
          price: 'ad',
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
        expect(res.body.error).to
          .equal('Price field is required and must be a number above zero');
      });
  });
};
