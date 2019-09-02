// Set the node environment variable to test
process.env.NODE_ENV = 'test';

// Require dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

chai.use(chaiHttp);
chai.should();

/*
 * Test the Auth Login /POST route
*/

describe('/POST Auth Login', () => {
  it('it should return a token and expires in', (done) => {
    try {
      let credentials = {
        username: 'test',
        password: 'test',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(credentials)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('expiresIn');
          res.body.token.should.be.a('string');
          res.body.expiresIn.should.be.a('number');
          done();
        });
    } catch (err) {
      throw err;
    };
  });
  it('it should return error if username is empty', (done) => {
    try {
      let credentials = {
        username: '',
        password: 'test',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(credentials)
        .end((err, res) => {
          if (err) {};
          res.should.have.status(422);
          res.body.should.be.a('object');
          done();
        });
    } catch (err) {
      throw err;
    }
  });
  it('it should return error if password is empty', (done) => {
    try {
      let credentials = {
        username: 'test',
        password: '',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(credentials)
        .end((err, res) => {
          if (err) {};
          res.should.have.status(422);
          res.body.should.be.a('object');
          done();
        });
    } catch (err) {
      throw err;
    }
  });
  it('it should return error if both username and password are empty',
    (done) => {
      try {
        let credentials = {
          username: '',
          password: '',
        };
        chai.request(server)
          .post('/api/v1/auth/login')
          .send(credentials)
          .end((err, res) => {
            if (err) {};
            res.should.have.status(422);
            res.body.should.be.a('object');
            done();
          });
      } catch (err) {
        throw err;
      }
    });
});

/*
 * Test the JSON Patch /POST route
*/

describe('/POST JSON Patch', () => {
  let token = '';
  before(done => {
    try {
      let credentials = {
        username: 'test',
        password: 'test',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(credentials)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('expiresIn');
          res.body.token.should.be.a('string');
          res.body.expiresIn.should.be.a('number');
          token = res.body.token;
          done();
        });
    } catch (err) {
      throw err;
    };
  });
  it('it should return the patched JSON', (done) => {
    try {
      let toBePatched = {
        mydoc: {
          baz: 'qux',
          foo: 'bar',
        },
        thepatch: [
          { op: 'replace', path: '/baz', value: 'boo' },
        ],
      };
      chai.request(server)
        .post('/api/v1/json/patch')
        .set('Authorization', `Bearer ${token}`)
        .send(toBePatched)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('patchedDoc');
          res.body.patchedDoc.should.be.a('object');
          done();
        });
    } catch (err) {
      throw err;
    };
  });
  it('it should return error if either mydoc or thepatch are empty', (done) => {
    try {
      let toBePatched = {
        thepatch: [
          { op: 'replace', path: '/baz', value: 'boo' },
        ],
      };
      chai.request(server)
        .post('/api/v1/image/resize')
        .set('Authorization', `Bearer ${token}`)
        .send(toBePatched)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          done();
        });
    } catch (err) {
      throw err;
    };
  });
  it('it should return error if more than 2 keys are sent', (done) => {
    try {
      let toBePatched = {
        mydoc: {
          baz: 'qux',
          foo: 'bar',
        },
        thepatch: [
          { op: 'replace', path: '/baz', value: 'boo' },
        ],
        mydoc1: {
          baz: 'qux',
          foo: 'bar',
        },
        thepatch1: [
          { op: 'replace', path: '/baz', value: 'boo' },
        ],
      };
      chai.request(server)
        .post('/api/v1/image/resize')
        .set('Authorization', `Bearer ${token}`)
        .send(toBePatched)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          done();
        });
    } catch (err) {
      throw err;
    };
  });
});

/*
 * Test the Image Resize /POST route
*/

describe('/POST Image Resize', () => {
  let token = '';
  before(done => {
    try {
      let credentials = {
        username: 'test',
        password: 'test',
      };
      chai.request(server)
        .post('/api/v1/auth/login')
        .send(credentials)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('expiresIn');
          res.body.token.should.be.a('string');
          res.body.expiresIn.should.be.a('number');
          token = res.body.token;
          done();
        });
    } catch (err) {
      throw err;
    };
  });
  it('it should return the saved image url', (done) => {
    try {
      let imageUrl = {
        imageUrl: 'https://www.google.com/images/srpr/logo3w.png',
      };
      chai.request(server)
        .post('/api/v1/image/resize')
        .set('Authorization', `Bearer ${token}`)
        .send(imageUrl)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('imageUrl');
          res.body.imageUrl.should.be.a('string');
          done();
        });
    } catch (err) {
      throw err;
    };
  });
  it('it should return error if no image url is sent', (done) => {
    try {
      let imageUrl = {
        imageUrl: '',
      };
      chai.request(server)
        .post('/api/v1/image/resize')
        .set('Authorization', `Bearer ${token}`)
        .send(imageUrl)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          done();
        });
    } catch (err) {
      throw err;
    };
  });
  it('it should return error if unsupported image format is sent', (done) => {
    try {
      let imageUrl = {
        imageUrl: 'https://www.google.com/images/srpr/logo3w.gif',
      };
      chai.request(server)
        .post('/api/v1/image/resize')
        .set('Authorization', `Bearer ${token}`)
        .send(imageUrl)
        .end((err, res) => {
          if (err) throw err;
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          done();
        });
    } catch (err) {
      throw err;
    };
  });
});
