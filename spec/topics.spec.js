const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);

module.exports = () => {
  describe('/topics', () => {
    describe('/api/topics', () => {
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
    });
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

    describe('/api/topics/:topic/articles', () => {
      it('GET request returns 200 and responds with the correct keys for the data sent back!', () => request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0]).to.have.all.keys(
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
          expect(body.article[0].author).to.eql('rogersop');
          expect(body.article[0].article_id).to.eql(5);
          expect(body.article[0].votes).to.eql(0);
        }));

      describe('Parametic query', () => {
        it('GET request returns 200 and tests the req.parmas.topic is equal to the topic in the data sent back!', () => request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].topic).to.eql('cats');
          }));
      });
      describe('Count', () => {
        it('GET request returns 200 and tests the count works succesufully and count all the comment for that specifc id', () => request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].comment_count).to.eql('2');
          }));
      });
      describe('Queries: Limit', () => {
        it('GET request returns 200 and tests the limit default to 10 so only 10 will show per page', () => request
          .get('/api/topics/mitch/articles?limit=3')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.length(3);
          }));
      });
      describe('Queries: SortBy & SortAscdending', () => {
        it('GET request returns 200 and tests that it comes back in ascending order when the query is set to true', () => request
          .get('/api/topics/mitch/articles?sort_ascending=true')
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].title).to.eql('Moustache');
          }));
        it('GET request returns 200 and tests that it comes back in descedning order as default', () => request
          .get('/api/topics/mitch/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].title).to.eql('Living in the shadow of a great man');
          }));
      });
      describe('Queries: Page', () => {
        it('GET request returns 200 and test that the page works succesfully when the page is set to 1 it will skip the first 10 values', () => request
          .get('/api/topics/mitch/articles?page=1')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.length(10);
          }));
      });
    });
    describe('/api/topics/:topic/articles', () => {
      it('POST request returns 201 and responds with the correct newly added article data', () => {
        const newArticle = {
          title: 'Just another day at northcoders',
          body: 'Been a super day!',
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/cats/articles')
          .expect(201)
          .send(newArticle)
          .then(({ body }) => {
            expect(body.articleAdded.article_id).to.eql(13);
            expect(body.articleAdded.title).to.eql('Just another day at northcoders');
            expect(body.articleAdded.username).to.eql('butter_bridge');
          });
      });
      it('POST request returns 201 and that the topic is added through the parametic query', () => {
        const newArticle = {
          title: 'Just another day at northcoders',
          body: 'Been a super day!',
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/cats/articles')
          .expect(201)
          .send(newArticle)
          .then(({ body }) => {
            expect(body.articleAdded.topic).to.eql('cats');
          });
      });
      it('POST request returns 201 and that the vote is added and set to 0 by default', () => {
        const newArticle = {
          title: 'Just another day at northcoders',
          body: 'Been a super day!',
          username: 'butter_bridge',
        };
        return request
          .post('/api/topics/cats/articles')
          .expect(201)
          .send(newArticle)
          .then(({ body }) => {
            expect(body.articleAdded.votes).to.eql(0);
          });
      });
    });
    describe('Error Handling : api/topics', () => {
      it('POST status returns 400 - client has inputted incorrect data', () => {
        const badData = {
          animal: 'Fish',
          Type: 'Smelly',
        };
        return request
          .post('/api/topics')
          .send(badData)
          .expect(400);
      });
      it('PATCH status returns 405 - client not allowed to execute that method', () => request.patch('/api/topics').expect(405));
      it('DELETE status returns 405 - client not allowed to execute that method', () => request.delete('/api/topics').expect(405));
    });
    describe('Error Handling : api/topics/:topic/aritcles', () => {
      it('GET status returns 404 - client has inputted an incorrect parametic query', () => request.get('/api/topics/hdfhdsf/articles').expect(404));
      it('GET status returns 400 - the sort criteria query is invalid', () => request.get('/api/topics/mitch/articles?sort_by=elf').expect(400));
      it('PATCH status returns 405 - client not allowed to execute that method', () => request.patch('/api/topics/mitch/articles').expect(405));
      it('DELETE status returns 405 - client not allowed to execute that method', () => request.delete('/api/topics/mitch/articles').expect(405));
    });
  });
};
