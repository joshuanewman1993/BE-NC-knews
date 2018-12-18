/* eslint-disable */
\c nc_news_test;
SELECT *
FROM articles
    JOIN topics ON topics.slug = articles.topic
WHERE topics.slug = 'mitch';
