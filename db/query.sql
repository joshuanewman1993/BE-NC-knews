\c nc_news_test;
SELECT articles.username AS author, articles.title, articles.article_id, articles.votes, articles.created_at, articles.topic
FROM articles
    -- JOIN users ON users.username = articles.username
    JOIN topics ON topics.slug = articles.topic
WHERE topics.slug = 'cats';
