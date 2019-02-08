const _ = require('lodash');
const request = require('superagent');
const constant = require('src/utils/constants');
const slackClient = require('src/utils/slack');

module.exports = async (argv) => {
  console.log('fetching query result....');
  const { body } = await request.get(argv.jsonQueryResultEndpoint);
  console.log('fetching query result done');

  const attachmentFields = _.map(body.query_result.data.rows, (row, idx) => {
    return {
      title: `row ${idx + 1}`,
      value: JSON.stringify(row)
    };
  });
  const queryId = _.chain(argv.jsonQueryResultEndpoint)
    .split('/')
    .dropRight()
    .last()
    .value()
  const baseUrl = _.chain(argv.jsonQueryResultEndpoint)
    .split('/')
    .dropRightWhile((key) => key !== 'api')
    .dropRight()
    .join('/')
    .value();
  const queryUrl = _.join([
    baseUrl,
    'queries',
    queryId
  ], '/');

  return slackClient.chat.postMessage({
    channel: argv.channel,
    icon_emoji: argv.avatar || ':information_source:',
    username: argv.username || 'Redash reporter',
    attachments: [{
      fields: attachmentFields,
      color: constant.slackStatusColors.good,
      pretext: argv.queryName,
      title: 'Query Report',
      text: queryUrl
    }]
  });
};

