const query = require('../models/query');

async function getHomePageData(req, res) {
  const posts = await query.getRecentPosts(req);
  res.send(posts);
}

module.exports = {
  getHomePageData,
};
