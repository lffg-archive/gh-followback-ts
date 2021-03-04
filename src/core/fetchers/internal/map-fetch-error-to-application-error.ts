import { assertNever } from '../../../utils/assertions';
import type { AnyFetchError, AnyApplicationError } from '../../types/errors';

export function mapFetchErrorToApplicationError(
  error: AnyFetchError
): AnyApplicationError {
  switch (error.code) {
    case 'UnknownApplicationError':
      return error;

    case 'UnknownFetchError':
      return {
        code: 'UnknownApplicationError',
        error: error.responseJSON
      };

    case 'RateLimitFetchError':
      return {
        code: 'TooSmallRateLimitQuotaApplicationError',
        available: error.rateLimitInformation.total,
        totalRequired: 1
      };

    case 'UserNotFoundFetchError':
      return {
        code: 'UserNotFoundApplicationError'
      };

    case 'AuthenticationFetchError':
      return {
        code: 'InvalidAccessTokenApplicationError'
      };

    default:
      assertNever(error);
  }
}
