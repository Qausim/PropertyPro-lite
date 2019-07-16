import testConfig from '../config/test_config';
import { clearTestUsersRecords } from '../helpers/test_hooks_helper';


const { chai, expect, app } = testConfig;
const signinUrl = '/api/v1/auth/signin';

export default () => {
  // Test user object
  let user = {
    email: 'qauzeem@propertyprolite.com',
    first_name: 'Olawumi',
    last_name: 'Yusuff',
    password: '123456',
    phone_number: '08000000000',
    address: 'Iyana Ipaja, Lagos',
    is_agent: false,
  };

  // Sign up test user object before tests
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .then((res) => {
        if (res.status === 201) {
          user = res.body.data;
          done();
        } else {
          throw new Error('Could not insert admin');
        }
      })
      .catch(error => done(error));
  });

  // Clear user db after tests run
  after(clearTestUsersRecords);


  // Tests that are meant to pass
  describe('success', () => {
    it('should log in a user successfully', async () => {
      const { email } = user;
      const password = '123456';

      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email, password });

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('email');
      expect(res.body.data).to.have.property('first_name');
      expect(res.body.data).to.have.property('last_name');
      expect(res.body.data).to.have.property('phone_number');
      expect(res.body.data).to.have.property('address');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('is_admin');
      expect(res.body.data).to.have.property('is_agent');
      expect(res.body.data.id).to.equal(user.id);
      expect(res.body.data.email).to.equal(user.email);
      expect(res.body.data.first_name).to.equal(user.first_name);
      expect(res.body.data.last_name).to.equal(user.last_name);
      expect(res.body.data.phone_number).to.equal(user.phone_number);
      expect(res.body.data.address).to.equal(user.address);
      expect(res.body.data.is_agent).to.equal(user.is_agent);
    });
  });


  // Tests that are meant to fail
  describe('failure', () => {
    it('should fail to log in a user with incorrect email', async () => {
      const data = {
        email: 'ola@propertyprolite.com',
        password: '123456',
      };

      const res = await chai.request(app)
        .post(signinUrl)
        .send(data);

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid email or password');
    });

    it('should fail to log in a user with invalid email format', async () => {
      const data = {
        email: 'qauzeem@propertyprolite',
        password: '123456',
      };

      const res = await chai.request(app)
        .post(signinUrl)
        .send(data);

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid email or password');
    });

    it('should fail to log in a user with incorrect password', async () => {
      const data = {
        email: user.email,
        password: 'abcdefg',
      };

      const res = await chai.request(app)
        .post(signinUrl)
        .send(data);

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.equal('Invalid email or password');
    });
  });
};
