const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);

module.exports = () => {
  describe('/articles', () => {
    describe('/api/article', () => {
      it('GET request returns 200 and an array of articles with the correct properties', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('array');
          expect(body.articles[0]).to.have.all.keys(
            'author',
            'title',
            'article_id',
            'votes',
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
          expect(body.articles[0].comment_count).to.eql('13');
        }));
    });
    describe('Queries: Limit', () => {
      it('GET request returns 200 and tests that the limit works succesfully', () => request
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
        }));
    });
    describe('Queries: SortBy & SortAscending', () => {
      it('GET request returns 200 and tests it comes back in descending order by default', () => request
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.eql(12);
        }));
      it('GET request returns 200 and tests it comes back in ascending order when the query is set to true', () => request
        .get('/api/articles?sort_by=article_id&&sort_ascending=true')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.eql(1);
        }));
    });
    describe('Queries: Page', () => {
      it('GET request returns 200 and tests that the Page works succesfully as the second page only has 2 articles!', () => request
        .get('/api/articles?sort_by=article_id&&page=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.have.length(10);
        }));
    });
    describe('Error Handling : api/articles', () => {
      it('POST status returns 405 - client not allowed to execute that method', () => request.post('/api/articles').expect(405));
      it('PATCH status returns 405 - client not allowed to execute that method', () => request.patch('/api/articles').expect(405));
      it('DELETE status returns 405 - client not allowed to execute that method', () => request.delete('/api/articles').expect(405));
    });
    describe('/api/articles/:article_id', () => {
      it('GET request returns 200 and an array of articles with the correct properties by a specfic article ID', () => request
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an('object');
          expect(body.articles).to.have.all.keys(
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
          expect(body.articles.author).to.eql('icellusedkars');
          expect(body.articles.article_id).to.eql(2);
          expect(body.articles.topic).to.eql('mitch');
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
      it('DELETE request returns 204 and deletes the article succesfully by the article_id. It will send back an empty object the user', () => request
        .delete('/api/articles/2')
        .expect(204)
        .then(({ body }) => {
          expect(body).to.eql({});
        }));
    });

    describe('Error Handling : api/articles/:article_id', () => {
      it('GET status returns 404 - client has inputted an incorrect parametic query (aritcle_id)', () => request.get('/api/articles/3222').expect(404));
      it('PATCH status returns 400 - client has inputted incorrect data', () => request
        .patch('/api/articles/2')
        .send({ inc_votes: 'hello' })
        .expect(400));
      it('DELETE status returns 404 - client has inputted an incorrect parametic query (aritcle_id) to delete', () => request.delete('/api/articles/3222').expect(404));
    });
    describe('/api/articles/:article_id/comments', () => {
      it('GET request returns 200 with the correct comments data by specific article_id and the object properties are correct.', () => request
        .get('/api/articles/9/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.have.all.keys(
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
          expect(body.comments.comment_id).to.eql(1);
          expect(body.comments.votes).to.eql(16);
          expect(body.comments.author).to.eql('butter_bridge');
        }));
      it('POST request returns 201 and that the comment is added to that specific article_id', () => {
        const newComment = {
          body: 'This is a new body!!!',
          username: 'butter_bridge',
        };
        return request
          .post('/api/articles/9/comments')
          .expect(201)
          .send(newComment)
          .then(({ body }) => {
            expect(body.comment.username).to.eql('butter_bridge');
            expect(body.comment.body).to.eql('This is a new body!!!');
          });
      });
      it('PATCH request returns 200 and increments the VOTE property on the comments table positively.', () => request
        .patch('/api/articles/2/comments/2')
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.eql(19);
        }));
      it('PATCH request returns 200 and increments the VOTE property on the comments table negatively.', () => request
        .patch('/api/articles/2/comments/2')
        .send({ inc_votes: -2 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.eql(12);
        }));
      it('DELETE request returns 200 and deletes the comment succesfully by the comment_id. It will send back an empty object the user', () => request
        .delete('/api/articles/2/comments/2')
        .expect(204)
        .then(({ body }) => {
          expect(body).to.eql({});
        }));
    });

    describe('Queries: Limit', () => {
      it('GET request returns 200 and limits the number of the page to one as set in the query', () => request
        .get('/api/articles/9/comments?limit=1')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.comment_id).to.eql(1);
        }));
    });
    describe('Queries: SortBy & SortAscending', () => {
      it('GET request returns 200 and tests that the data comes back in descending order by default', () => request
        .get('/api/articles/9/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.comment_id).to.eql(1);
        }));
      it('GET request returns 200 and tests that the data comes back in descending order by default', () => request
        .get('/api/articles/9/comments?sort_ascending=true')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.comment_id).to.eql(17);
        }));
      it('GET request returns 200 and tests that the data gets sorted by votes in descending order by default', () => request
        .get('/api/articles/1/comments?sort_by=votes')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.votes).to.eql(100);
        }));
    });

    describe('Error Handling : api/aricles/:article_id/comments', () => {
      it('GET status returns 404 - client has inputted an incorrect parametic query (aritcle_id)', () => request.get('/api/articles/3222').expect(404));
      it('POST status returns 400 - client has inputted incorrect comments data', () => {
        const badData = {
          animal: 'Fish',
          Type: 'Smelly',
        };
        return request
          .post('/api/articles/2/comments')
          .send(badData)
          .expect(400);
      });
      it('PATCH status returns 400 - client has inputted incorrect data', () => request
        .patch('/api/articles/2/comments/2')
        .send({ inc_votes: 'hello' })
        .expect(400));
      it('DELETE status returns 404 - client has inputted an incorrect parametic query (comment_id) to delete', () => request.delete('/api/articles/2/comments/3543222').expect(404));
    });
  });
};
