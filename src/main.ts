import * as chalk from 'chalk';
import { mainFollowListsFetcher } from './core/fetchers';
import { humanizeBool, mapApplicationErrorToUserMessage } from './utils/human';
import * as io from './utils/io';
import { isErr } from './utils/result';

export function main(args: string[]): void {
  void args;

  run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Whoops! Something went wrong:');
      console.error(error);
    });
}

async function run() {
  let lastStep = io.registerStep({});

  //
  // Step 1:
  // Get GitHub username.
  //
  io.puts([
    chalk`{bold gh-followback} - GitHub Followback Checker`,
    'Checks which of the users you are following follow you back.',
    ''
  ]);
  const username = await io.gets('Enter the GitHub username to lookup: ');
  lastStep = io.registerStep({
    ...lastStep,
    'Username:': username
  });

  //
  // Step 2:
  // Get (or not) the GitHub API personal token.
  //
  io.puts([
    chalk`GitHub API has a rate limit policy, which makes this CLI unsuitable to fetch a long list of followers and following users. To unauthenticated users, GitHub imposes a maximum of {bold 60 requests per hour}, associated with the originating IP address.`,
    '',
    'To learn more, check the GitHub documentation at:',
    chalk`{cyan https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting}`,
    '',
    'To increase that limit, you can use a personal access token. This application does not require any special scope. You can generate a new personal access token here:',
    chalk`{cyan https://github.com/settings/tokens/new}`,
    ''
  ]);
  let useAccessToken = await io.getsBoolean(
    'Do you want to use a personal access token to increase that limit?',
    { defaultResponse: 'yes' }
  );
  let accessToken: string | undefined;
  if (useAccessToken) {
    lastStep = io.registerStep({
      ...lastStep,
      'Use personal token:': humanizeBool(useAccessToken)
    });
    io.puts([
      'You can create a new personal token at:',
      chalk`{cyan https://github.com/settings/tokens/new}`,
      '',
      chalk`If you {bold DON'T} want to use a personal access token, press {bold Enter} (leave the field blank).`,
      ''
    ]);
    accessToken = await io.gets('Enter your GitHub personal token: ');
    if (!accessToken) {
      accessToken = undefined;
      useAccessToken = false;
    }
  }

  //
  // Step 3:
  // Fetch selected user info.
  //
  io.registerStep({
    ...lastStep,
    'Use personal token:': humanizeBool(useAccessToken)
  });
  const result = await mainFollowListsFetcher({
    username,
    accessToken
  });
  if (isErr(result)) {
    const message = mapApplicationErrorToUserMessage(result.data);
    io.puts(chalk`{red error:} ${message}`);
    process.exit(1);
  }
  console.log(result.data);
}
