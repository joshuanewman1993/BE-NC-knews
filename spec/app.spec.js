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
    it('GET request returns 200 and responds with the correct keys for the data sent back!', () => request
      .get('/api/topics/cats/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0]).to.have.all.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'created_at',
          'topic',
          'comment_count',
        );
      }));
    it('GET request returns 200 and responds with the correct data!', () => request
      .get('/api/topics/cats/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0].author).to.eql('rogersop');
        expect(body.data[0].article_id).to.eql(5);
        expect(body.data[0].votes).to.eql(0);
      }));
    it('GET request returns 200 and tests the req.parmas.topic is equal to the topic in the data sent back!', () => request
      .get('/api/topics/cats/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0].topic).to.eql('cats');
      }));

    it('GET request returns 200 and tests the count works succesufully and count all the comment for that specifc id', () => request
      .get('/api/topics/cats/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0].comment_count).to.eql('2');
      }));
    it('GET request returns 200 and tests the limit default to 10 so only 10 will show per page', () => request
      .get('/api/topics/mitch/articles?limit=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.data).to.have.length(3);
      }));
    it('GET request returns 200 and tests that it comes back in ascending order when the query is set to true', () => request
      .get('/api/topics/mitch/articles?sort_ascending=true')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0].title).to.eql('Moustache');
      }));
    it('GET request returns 200 and tests that it comes back in descedning order as default', () => request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0].title).to.eql('Living in the shadow of a great man');
      }));
  });
});
