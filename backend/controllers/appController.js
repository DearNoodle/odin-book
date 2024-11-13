const query = require('../models/query');

async function getUsername(req, res) {
  const username = await query.getUsername(req);
  res.send(username);
}

async function getUserInfo(req, res) {
  const user = await query.getUserInfo(req);
  res.send(user);
}

async function getChatMessages(req, res) {
  const messages = await query.getChatMessages(req);
  res.send(messages);
}
async function createMessage(req, res) {
  await query.createMessage(req);
  res.send();
}
async function getFollowedUsers(req, res) {
  const userFollows = await query.getFollowedUsers(req);
  res.send(userFollows);
}

async function getRecentPosts(req, res) {
  const recentPosts = await query.getRecentPosts();
  res.send(recentPosts);
}

async function getUserPosts(req, res) {
  const userPosts = await query.getUserPosts(req);
  res.send(userPosts);
}

async function getSearchUsers(req, res) {
  const users = await query.getSearchUsers(req);
  res.send(users);
}

async function getSearchPosts(req, res) {
  const posts = await query.getSearchPosts(req);
  res.send(posts);
}

module.exports = {
  getUsername,
  getUserInfo,
  getChatMessages,
  createMessage,
  getFollowedUsers,
  getRecentPosts,
  getUserPosts,
  getSearchUsers,
  getSearchPosts,
};
