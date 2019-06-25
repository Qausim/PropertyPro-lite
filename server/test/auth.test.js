import chai from 'chai';
import chaiHttp from 'chai-http';

import '../server';
import app from '../app';


const { expect } = chai;
chai.use(chaiHttp);

describe('POST /auth/signup', () => {
  it('should create a new user', async () => {
    const data = {
      email: 'qauzeem@example.com',
      firstName: 'Olawumi',
      lastName: 'Yusuff',
      phoneNumber: '08000000000',
      address: 'Iyana Ipaja, Lagos',
      password: '123456',
      isAdmin: true,
      isAgent: true,
    };

    const res = await chai.request(app)
      .post('/auth/signup')
      .send(data);

    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('id');
    expect(res.body.data).to.have.property('email');
    expect(res.body.data).to.have.property('firstName');
    expect(res.body.data).to.have.property('lastName');
    expect(res.body.data).to.have.property('phoneNumber');
    expect(res.body.data).to.have.property('address');
    expect(res.body.data).to.have.property('token');
    expect(res.body.data).to.have.property('isAdmin');
    expect(res.body.data).to.have.property('isAgent');
    expect(res.body.data.email).to.equal(data.email);
    expect(res.body.data.firstName).to.equal(data.firstName);
    expect(res.body.data.lastName).to.equal(data.lastName);
    expect(res.body.data.phoneNumber).to.equal(data.phoneNumber);
    expect(res.body.data.address).to.equal(data.address);
    expect(res.body.data.isAdmin).to.equal(data.isAdmin);
    expect(res.body.data.isAgent).to.equal(data.isAgent);
  });
});
