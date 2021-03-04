import { assertNever } from '../../../utils/assertions';
import type { AnyFetchError, AnyApplicationError } from '../../types/errors';

function createJSONError(data: unknown): Error & { data: unknown } {
  const error: Error & { data: unknown } = new Error() as any;
  error.data = data;
  return error;
}

export function mapFetchErrorToApplicationError(
  error: AnyFetchError
): AnyApplicationError {
  switch (error.code) {
    case 'RequestUnknownError':
      return {
        code: 'UnknownError',
        errorObject: createJSONError(error.responseJSON)
      };

    case 'RequestProcessingError':
      return {
        code: 'UnknownError',
        errorObject: error.errorObject
      };

    case 'RateLimitRequestError':
      return {
        code: 'TooSmallRateLimitQuotaError',
        available: 0, // FIXME
        totalRequired: 0 // FIXME
      };

    case 'AuthenticationRequestError':
      return {
        code: 'InvalidAccessTokenError'
      };

    default:
      assertNever(error);
  }
}
