// const { data } = require('./data');
const { topicData, userData, articleData, commentData } = require('../data');
exports.seed = function(knex, Promise) {
	return Promise.all([
		knex('topics').del(), // Deletes ALL existing entries
		knex('users').del(),
		knex('articles').del(),
	])

		.then(() => knex('topics').insert(topicData))
		.then(() => knex('users').insert(userData))
		.then(() => knex('articles').insert(articleData));
	// .then(() => knex('comments').insert(commentData));
};
