const query = require('../models/query');

async function getUserProfile(req, res) {
  const profile = await query.getUserProfile(req);
  res.send(profile);
}

async function updateProfileImage(req, res) {
  await query.updateProfileImage(req);
  res.send();
}
async function updateProfileBio(req, res) {
  await query.updateProfileBio(req);
  res.send();
}

async function getUsername(req, res) {
  const username = await query.getUsername(req);
  res.send(username);
}

async function getChatMessages(req, res) {
  const messages = await query.getChatMessages(req);
  res.send(messages);
}
async function createMessage(req, res) {
  await query.createMessage(req);
  res.send();
}
async function getRecentChatters(req, res) {
  const recentChatters = await query.getRecentChatters(req);
  res.send(recentChatters);
}

async function getRecentPosts(req, res) {
  const recentPosts = await query.getRecentPosts();
  res.send(recentPosts);
}

async function getSearchUsers(req, res) {
  const search = await query.getSearchUsers(req);
  res.send(search);
}

async function getSearchPosts(req, res) {
  const search = await query.getSearchPosts(req);
  res.send(search);
}

module.exports = {
  getUserProfile,
  updateProfileImage,
  updateProfileBio,
  getUsername,
  getChatMessages,
  createMessage,
  getRecentChatters,
  getRecentPosts,
  getSearchUsers,
  getSearchPosts,
};
