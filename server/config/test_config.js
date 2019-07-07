// General configuration for all test files

import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

export default { chai, expect, app };
