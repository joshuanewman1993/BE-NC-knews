//THIS FUNCTION IS USED TO CONVERT THE TIMESTAMP
function timeConverter(UNIX_timestamp) {
	const a = new Date(UNIX_timestamp * 1000);
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const year = a.getFullYear();
	const month = months[a.getMonth()];
	const date = a.getDate();
	const hour = a.getHours();
	const min = a.getMinutes();
	const sec = a.getSeconds();
	const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
	return time;
}

//THIS IS USED TO FORMAT THE ARTICLE DATA
exports.formatArticle = articles =>
	articles.map(({ created_by, created_at, ...articles }) => ({
		username: created_by,
		created_at: timeConverter(created_at),
		...articles,
	}));

exports.formatComments = (comments, article) => {
	console.log(article);
	return comments.map(({ belongs_to, created_by, created_at, ...comments }) => {
		const matchingArticle = article.filter(article => article.title === belongs_to);
		return {
			username: created_by,
			article_id: matchingArticle[0].article_id,
			created_at: timeConverter(created_at),
			...comments,
		};
	});
};

// Strategy 1 : map and then use find
// Strategy 2 : map and filter
// Strategy 3 : map and ref object
