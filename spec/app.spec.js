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

      describe('Parametic query', () => {
        it('GET request returns 200 and tests the req.parmas.topic is equal to the topic in the data sent back!', () => request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.data[0].topic).to.eql('cats');
          }));
      });
      describe('Count', () => {
        it('GET request returns 200 and tests the count works succesufully and count all the comment for that specifc id', () => request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.data[0].comment_count).to.eql('2');
          }));
      });
      describe('Queries: Limit', () => {
        it('GET request returns 200 and tests the limit default to 10 so only 10 will show per page', () => request
          .get('/api/topics/mitch/articles?limit=3')
          .expect(200)
          .then(({ body }) => {
            expect(body.data).to.have.length(3);
          }));
      });
      describe('Queries: SortBy & SortAscdending', () => {
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
      describe('Queries: Page', () => {
        it('GET request returns 200 and test that the page works succesfully when the page is set to 1 it will skip the first 10 values', () => request
          .get('/api/topics/mitch/articles?page=1')
          .expect(200)
          .then(({ body }) => {
            expect(body.data).to.have.length(1);
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
      it('GET status returns 400 - the sort criteria query is invalid', () => request.get('/api/topics/mitch/articles?sort_criteria=elf').expect(400));
      it('PATCH status returns 405 - client not allowed to execute that method', () => request.patch('/api/topics/mitch/articles').expect(405));
      it('DELETE status returns 405 - client not allowed to execute that method', () => request.delete('/api/topics/mitch/articles').expect(405));
    });
  });
  describe('/articles', () => {
    describe('/api/article', () => {
      it('GET request returns 200 and an array of articles with the correct properties', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.data).to.be.an('array');
          expect(body.data[0]).to.have.all.keys(
            'author',
            'title',
            'article_id',
            'votes',
            'body',
            'comment_count',
            'created_at',
            'topic',
          );
        }));
    });
    describe('Count', () => {
      it('GET request returns 200 and repsonds with comment count that works sucesfully', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.data[0].comment_count).to.eql('13');
        }));
    });
    describe('Queries: Limit', () => {
      it('GET request returns 200 and tests that the limit works succesfully', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.data).to.have.length(10);
        }));
    });
    describe('Queries: SortBy & SortAscending', () => {
      it('GET request returns 200 and tests it comes back in descending order by default', () => request
        .get('/api/articles?sort_criteria=article_id')
        .expect(200)
        .then(({ body }) => {
          expect(body.data[0].article_id).to.eql(12);
        }));
      it('GET request returns 200 and tests it comes back in ascending order when the query is set to true', () => request
        .get('/api/articles?sort_criteria=article_id&&sort_ascending=true')
        .expect(200)
        .then(({ body }) => {
          expect(body.data[0].article_id).to.eql(1);
        }));
    });
    describe('Queries: Page', () => {
      it('GET request returns 200 and tests that the Page works succesfully as the second page only has 2 articles!', () => request
        .get('/api/articles?sort_criteria=article_id&&page=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.data).to.have.length(2);
        }));
    });
    describe('Error Handling : api/articles', () => {
      it('POST status returns 405 - client not allowed to execute that method', () => request.post('/api/articles').expect(405));
      it('PATCH status returns 405 - client not allowed to execute that method', () => request.patch('/api/articles').expect(405));
      it('DELETE status returns 405 - client not allowed to execute that method', () => request.delete('/api/articles').expect(405));
    });
  });
  describe('/api/articles/:article_id', () => {
    it('GET request returns 200 and an array of articles with the correct properties by a specfic article ID', () => request
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.data).to.be.an('array');
        expect(body.data[0]).to.have.all.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'body',
          'comment_count',
          'created_at',
          'topic',
        );
      }));
    it('GET request returns 200 with the correct data', () => request
      .get('/api/articles/2')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0].author).to.eql('icellusedkars');
        expect(body.data[0].article_id).to.eql(2);
        expect(body.data[0].topic).to.eql('mitch');
      }));
    it('PATCH request returns 200 and increments the VOTE property positively.', () => request
      .patch('/api/articles/2')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).to.eql(1);
      }));
    it('PATCH request returns 200 and increments the VOTE property negatively.', () => request
      .patch('/api/articles/2')
      .send({ inc_votes: -20 })
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).to.eql(-20);
      }));
    it('DELETE request returns 200 and deletes the article succesfully by the article_id. It will send back an empty object the user', () => request
      .delete('/api/articles/2')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.eql({});
      }));
  });

  describe('Error Handling : api/aricles/:article_id', () => {
    it('GET status returns 404 - client has inputted an incorrect parametic query (aritcle_id)', () => request.get('/api/articles/3222').expect(404));
    it('PATCH status returns 400 - client has inputted incorrect data', () => request
      .patch('/api/articles/2')
      .send({ inc_votes: 'hello' })
      .expect(400));
    it('DELETE status returns 404 - client has inputted an incorrect parametic query (aritcle_id) to delete', () => request.delete('/api/articles/3222').expect(404));
  });
  describe.only('/api/articles/:article_id/comments', () => {
    it('GET request returns 200 with the correct comments data by specific article_id and the object properties are correct.', () => request
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0]).to.have.all.keys(
          'comment_id',
          'votes',
          'created_at',
          'author',
          'body',
        );
      }));
    it('GET request returns 200 with the correct comments data for that specifc article_id.', () => request
      .get('/api/articles/9/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.data[0].comment_id).to.eql(1);
        expect(body.data[0].votes).to.eql(16);
        expect(body.data[0].author).to.eql('butter_bridge');
      }));
    describe('Queries: Limit', () => {
      it('GET request returns 200 and limits the number of the page to one as set in the query', () => request
        .get('/api/articles/9/comments?limit=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.data).to.have.length(1);
        }));
    });
    describe('Queries: SortBy & SortAscending', () => {
      it('GET request returns 200 and tests that the data comes back in descending order by default', () => request
        .get('/api/articles/9/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.data[0].comment_id).to.eql(1);
        }));
      it('GET request returns 200 and tests that the data comes back in descending order by default', () => request
        .get('/api/articles/9/comments?sort_ascending=true')
        .expect(200)
        .then(({ body }) => {
          expect(body.data[0].comment_id).to.eql(17);
        }));
      it('GET request returns 200 and tests that the data gets sorted by votes in descending order by default', () => request
        .get('/api/articles/1/comments?sort_criteria=votes')
        .expect(200)
        .then(({ body }) => {
          expect(body.data[0].votes).to.eql(100);
        }));
    });
  });
  describe('Error Handling : api/aricles/:article_id/comments', () => {
    it('GET status returns 404 - client has inputted an incorrect parametic query (aritcle_id)', () => request.get('/api/articles/3222').expect(404));
  });
});
