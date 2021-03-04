import { AnyApplicationError } from '../core/types/errors';
import { assertNever } from './assertions';

export function humanizeBool(bool: boolean, ucfirst = true): string {
  const out = bool ? 'Yes' : 'No';
  return ucfirst ? out : out.toLowerCase();
}

export function mapApplicationErrorToUserMessage(
  error: AnyApplicationError
): string {
  switch (error.code) {
    case 'UnknownApplicationError':
      return `Unknown error: ${(error.error as any).message ?? '????'}`;

    case 'InvalidAccessTokenApplicationError':
      return 'Invalid access token.';

    case 'UserNotFoundApplicationError':
      return 'Invalid user name. The provided user was not found in the GitHub API.';

    case 'TooSmallRateLimitQuotaApplicationError':
      return 'Too small rate limit quota to finish the requests to the GitHub API. Try again later.';

    default:
      assertNever(error);
  }
}
