const app = require('../app');
const request = require('supertest')(app);

module.exports = () => {
  describe.only('Feedback : Articles', () => {
    it('PATCH status returns 200 - client has tried to patch where no data was updated so didnt not update ', () => request
      .patch('/api/articles/2')
      .expect(200)
      .then(console.log));
  });
  describe('Feedback : Topics', () => {
    it('POST status returns 400 - client has tried to insert malformed data which returns 400', () => {
      const badData = {
        animal: 'Fish',
      };
      return request
        .post('/api/topics')
        .send(badData)
        .expect(400);
    });
    it.only('POST status returns 400 - client has tried to insert malformed data which returns 400', () => {
      const badDataNoBody = {
        slug: 'Fish',
      };
      return request
        .post('/api/topics')
        .send(badDataNoBody)
        .expect(400);
    });
    it('POST status returns 422 - client has tried to enter a unique constraint that already exists', () => {
      const duplicated = {
        slug: 'mitch',
        description: 'The man, the Mitch, the legend',
      };
      return request
        .post('/api/topics')
        .send(duplicated)
        .expect(422);
    });
  });
};
