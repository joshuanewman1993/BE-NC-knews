exports.up = function(knex, Promise) {
	return knex.schema.createTable('articles', articleTable => {
		articleTable.string('article_id').primary();
		articleTable.unique('article_id');
		articleTable.string('title');
		articleTable.string('body');
		articleTable.integer('votes').defaultTo(0);
		articleTable.string('topic').references('topics.slug');
		articleTable.string('username').references('users.username');
		articleTable.timestamp('created_at').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('articles');
};
