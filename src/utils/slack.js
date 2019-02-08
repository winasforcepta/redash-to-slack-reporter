const { WebClient } = require('@slack/client');
const token = process.env.SLACK_BOT_TOKEN;

let client = null;

if (!client) {
  client = new WebClient(token);
}

module.exports = client;

