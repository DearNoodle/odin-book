const query = require('../models/query');

async function createMessage(req, res) {
  await query.createMessage(req);
  res.end();
}

module.exports = {
  createMessage,
};
