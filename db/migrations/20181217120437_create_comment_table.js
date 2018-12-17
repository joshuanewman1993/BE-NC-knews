exports.up = function(knex, Promise) {
	return knex.schema.createTable('comments', commentTable => {
		commentTable.string('comment_id').primary();
		commentTable.unique('comment_id');
		commentTable.string('username').references('users.username');
		commentTable.string('article_id').references('articles.article_id');
		commentTable.integer('votes').defaultTo(0);
		commentTable.timestamp('created_at').defaultTo(knex.fn.now());
		commentTable.string('body');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('comments');
};
