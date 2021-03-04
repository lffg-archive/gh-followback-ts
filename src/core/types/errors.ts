//
// Application errors.
//

export interface UnknownApplicationError {
  code: 'UnknownError';
  errorObject: unknown;
}

export interface TooSmallRateLimitQuotaApplicationError {
  code: 'TooSmallRateLimitQuotaError';
  available: number;
  totalRequired: number;
}

export interface InvalidAccessTokenApplicationError {
  code: 'InvalidAccessTokenError';
}

export type AnyApplicationError =
  | UnknownApplicationError
  | TooSmallRateLimitQuotaApplicationError
  | InvalidAccessTokenApplicationError;

//
// Fetch errors.
//

export interface UnknownFetchError {
  code: 'RequestUnknownError';
  status: number;
  responseJSON: unknown;
}

export interface ProcessingFetchError {
  code: 'RequestProcessingError';
  message: string;
  errorObject: unknown;
}

export interface RateLimitFetchError {
  code: 'RateLimitRequestError';
  status: 403;
  message: string;
  responseJSON: unknown;

  // TODO: Add current rate limit information
  // rateLimitInformation: RateLimitInformation;
}

export interface AuthenticationFetchError {
  code: 'AuthenticationRequestError';
  status: 401;
  message: string;
  responseJSON: unknown;
}

export type AnyFetchError =
  | UnknownFetchError
  | ProcessingFetchError
  | RateLimitFetchError
  | AuthenticationFetchError;
