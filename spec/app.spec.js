process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

describe('/api', () => {
  beforeEach(() => connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => connection.destroy());

  describe('/topics', () => {
    it('GET request returns 200 and an array of topics with the correct properties', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body: topics }) => {
        expect(topics).to.be.an('array');
        expect(topics[0]).to.have.all.keys('description', 'slug');
      }));
    it('GET request returns 200 and an array of topics with the correct length', () => request
      .get('/api/topics')
      .expect(200)
      .then(({ body: topics }) => {
        expect(topics).to.have.length(2);
      }));
    it('POST request returns 201 and responds with the correct newly added topics data', () => {
      const newTopic = {
        description: 'The man, the josh, the hero',
        slug: 'josh',
      };
      return request
        .post('/api/topics')
        .expect(201)
        .send(newTopic)
        .then(({ body }) => {
          expect(body.topic).to.eql(newTopic);
        });
    });
    it('POST request returns 201 and responds with the newly added topics data with the correct properties', () => {
      const newTopic = {
        description: 'The man, the josh, the hero',
        slug: 'josh',
      };
      return request
        .post('/api/topics')
        .expect(201)
        .send(newTopic)
        .then(({ body }) => {
          expect(body.topic).to.have.keys('description', 'slug');
          expect(body.topic.description).to.eql('The man, the josh, the hero');
          expect(body.topic.slug).to.eql('josh');
        });
    });
    it('GET request returns 200 and responds with all the articles for a specifc topic', () => request
      .get('/api/topics/cats/articles')
      .expect(200)
      .then(({ body }) => {
        console.log(body.data);
        expect(body.data[0].topic).to.eql('cats');
        expect(body.data[0].title).to.eql('UNCOVERED: catspiracy to bring down democracy');
        expect(body.data[0].body).to.eql(
          'Bastet walks amongst us, and the cats are taking arms!',
        );
      }));
  });
});
