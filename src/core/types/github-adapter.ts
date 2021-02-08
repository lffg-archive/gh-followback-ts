import type { PResult } from '../../utils/result';
import type { RateLimitInformation } from './core';
import type { AnyFetchError } from './errors';

export interface GitHubAPIRequest {
  accessToken?: string;
  path: string;
  queryParams?: Record<string, string>;
}

export interface GitHUbAPIResponse<T> {
  rateLimitInformation: RateLimitInformation;
  data: T;
}

export type GitHubAPIFetcher = <T>(
  request: GitHubAPIRequest
) => PResult<GitHUbAPIResponse<T>, AnyFetchError>;
