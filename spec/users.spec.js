const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);

module.exports = () => {
  describe('/users', () => {
    describe('/api/users', () => {
      it('GET request returns status code 200 returns an array of users objects with the correct properties', () => request
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('array');
          expect(body[0]).to.have.all.keys('username', 'avatar_url', 'name');
        }));
      it('GET request returns status code 200 returns the users object with the correct data', () => request
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(body[0].username).to.eql('butter_bridge');
          expect(body[0].avatar_url).to.eq;
          ('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
          expect(body[0].name).to.eql('jonny');
        }));
    });
    describe('Error Handling: api/users', () => {
      it('PATCH status returns 405 - client not allowed to execute that method', () => request.patch('/api/users').expect(405));
      it('DELETE status returns 405 - client not allowed to execute that method', () => request.delete('/api/users').expect(405));
      it('POST status returns 405 - client not allowed to execute that method', () => request.post('/api/users').expect(405));
    });
    describe('/api/users/username', () => {
      it('GET request returns status code 200 returns an array of users objects with the correct properties', () => request
        .get('/api/users/rogersop')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body).to.have.all.keys('username', 'avatar_url', 'name');
        }));
      it('GET request returns status code 200 returns the users object with the correct data', () => request
        .get('/api/users/rogersop')
        .expect(200)
        .then(({ body }) => {
          expect(body.username).to.eql('rogersop');
          expect(body.avatar_url).to.eq;
          ('https://avatars2.githubusercontent.com/u/24394918?s=400&v=4');
          expect(body.name).to.eql('paul');
        }));
    });
    describe('Error Handling: api/users/:username', () => {
      it('GET status returns 404 - client has inputted an incorrect parametic query (username)', () => request.get('/api/users/jdhnshssss').expect(404));
      it('PATCH status returns 405 - client not allowed to execute that method', () => request.patch('/api/users/rogersop').expect(405));
      it('DELETE status returns 405 - client not allowed to execute that method', () => request.delete('/api/users/rogersop').expect(405));
      it('POST status returns 405 - client not allowed to execute that method', () => request.post('/api/users/rogersop').expect(405));
    });
  });
};
