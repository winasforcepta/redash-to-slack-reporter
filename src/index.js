require('app-module-path').addPath(process.cwd());
require('dotenv').config()

const AVAILABLE_COMMANDS = {
  report: 'report'
};

const argv = require('yargs')
  .usage('Usage: node $0 [command] [options]')
  .command(AVAILABLE_COMMANDS['report'], 'report given redash query result to slack', {
    jsonQueryResultEndpoint: {
      alias: 'e',
      demand: true,
      describe: '',
      type: 'string'
    },
    username: {
      alias: 'u',
      demand: false,
      describe: '',
      type: 'string'
    },
    channel: {
      alias: 'c',
      demand: true,
      describe: '',
      type: 'string'
    },
    avatar: {
      alias: 'a',
      demand: false,
      describe: '',
      type: 'string'
    },
    queryName: {
      alias: 'n',
      demand: false,
      describe: '',
      default: '',
      type: 'string'
    }
  })
  .argv;

(async () => {
  const runner = require(`src/commands/${argv._}.js`)

  try {
    await runner(argv);
  } catch (e) {
    console.error(e.stack || e);
    process.exit(1);
  }

  process.exit(0);
})();
