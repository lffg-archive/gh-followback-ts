import type { RateLimitInformation } from './core';

//
// Application errors.
//

export interface UnknownApplicationError {
  code: 'UnknownApplicationError';
  error: unknown;
}

// May be returned in a "preflight" check.
export interface TooSmallRateLimitQuotaApplicationError {
  code: 'TooSmallRateLimitQuotaApplicationError';
  available: number;
  totalRequired: number;
}

export interface UserNotFoundApplicationError {
  code: 'UserNotFoundApplicationError';
}

export interface InvalidAccessTokenApplicationError {
  code: 'InvalidAccessTokenApplicationError';
}

export type AnyApplicationError =
  | UnknownApplicationError
  | UserNotFoundApplicationError
  | TooSmallRateLimitQuotaApplicationError
  | InvalidAccessTokenApplicationError;

//
// Fetch errors.
//

export interface UnknownFetchError {
  code: 'UnknownFetchError';
  status: number;
  responseJSON: unknown;
}

export interface RateLimitFetchError {
  code: 'RateLimitFetchError';
  rateLimitInformation: RateLimitInformation;
  status: 403;
  responseJSON: unknown;
}

export interface UserNotFoundFetchError {
  code: 'UserNotFoundFetchError';
  status: 404;
  responseJSON: unknown;
}

export interface AuthenticationFetchError {
  code: 'AuthenticationFetchError';
  status: 401;
  responseJSON: unknown;
}

export type AnyFetchError =
  | UnknownApplicationError
  | UnknownFetchError
  | RateLimitFetchError
  | UserNotFoundFetchError
  | AuthenticationFetchError;
