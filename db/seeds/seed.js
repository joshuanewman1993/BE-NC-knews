// const { data } = require('./data')
const { topicData, userData, articleData, commentData } = require('../data');
const { formatArticle, formatComments } = require('../utils/utils');

exports.seed = function(knex, Promise) {
	return Promise.all([
		knex('topics').del(), // Deletes ALL existing entries
		knex('users').del(),
		knex('articles').del(),
		knex('comments').del(),
	])
		.then(() => knex('topics').insert(topicData))
		.then(() => knex('users').insert(userData))
		.then(() => {
			const formattedData = formatArticle(articleData);
			return knex('articles')
				.returning(['article_id', 'title'])
				.insert(formattedData);
		})
		.then(returnedArticle => {
			const formattedComments = formatComments(commentData, returnedArticle);
			return knex('comments')
				.insert(formattedComments)
				.returning('*');
		});
};
