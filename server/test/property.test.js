import fs from 'fs';

import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;
const signupUrl = '/api/v1/auth/signup';
const image = fs.readFileSync('UI/images/propertya1.jpg');

let agent = {
  email: 'qauzeem@propertyprolite.com',
  firstName: 'Olawumi',
  lastName: 'Yusuff',
  password: '123456',
  phoneNumber: '08000000000',
  address: 'Iyana Ipaja, Lagos',
  isAdmin: false,
  isAgent: true,
};

before((done) => {
  const res = chai.request(app)
    .post(signupUrl)
    .send(agent);
  if (res.status === 201) {
    agent = res.body.data;
    done();
  }
  done();
});

const propertyUrl = '/api/v1/property';


describe('POST /api/v1/property', () => {
  describe('success', () => {
    it('should create a property ad successfully', async () => {
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
        .attach('propertyImage', data.image, 'image.jpg');

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
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updateOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.status).to.equal('available');
      expect(res.body.data.type).to.equal(data.type);
      expect(res.body.data.state).to.equal(data.state);
      expect(res.body.data.city).to.equal(data.city);
      expect(res.body.data.price).to.equal(data.price);
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
      expect(res.body.data).to.have.property('createdOn');
      expect(res.body.data).to.have.property('updateOn');
      expect(res.body.data).to.have.property('imageUrl');
      expect(res.body.data.status).to.equal('available');
      expect(res.body.data.type).to.equal(data.type);
      expect(res.body.data.state).to.equal(data.state);
      expect(res.body.data.city).to.equal(data.city);
      expect(res.body.data.price).to.equal(data.price);
    });
  });

  describe('failure', () => {
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
        expect(res.body.error).to.equal('Unauthorized');
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
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid state');
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
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid city');
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
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid address');
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
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Invalid price');
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
          .field('type', data.type)
          .field('city', data.city)
          .field('address', data.address)
          .field('price', data.price);

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.equal('error');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.equal('Price cannot be zero');
      });
  });
});
