import type { PResult } from '../../utils/result';
import type { RateLimitInformation } from './core';
import type { AnyFetchError } from './errors';

export interface GitHubAPIRequest {
  accessToken?: string;
  path: string;
  queryParams?: Record<string, string>;
}

export interface GitHubAPIResponse<T> {
  rateLimitInformation: RateLimitInformation;
  data: T;
}

export type GitHubAPIFetcher = <T>(
  request: GitHubAPIRequest
) => PResult<GitHubAPIResponse<T>, AnyFetchError>;
