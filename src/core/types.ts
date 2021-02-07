import { Result } from '../utils/result';

//
// Main types.
//

export type FollowedByLookupUserList = string[];
export type LookupUserFollowerList = string[];

export type FollowedByLookupUserCount = number;
export type LookupUserFollowerCount = number;

export interface FollowLists {
  followedByLookupUserList: FollowedByLookupUserList;
  lookupUserFollowerList: LookupUserFollowerList;
}

export type FollowMap = Record<string, number>;

//
// Rate limit information.
//

export interface RateLimitInformation {
  total: number;
  remaining: number;
  reset: Date;
}

//
// Information about the lookup user.
//

export interface LookupUserData {
  username: string;
  followedByLookupUserCount: FollowedByLookupUserCount;
  lookupUserFollowerCount: LookupUserFollowerCount;
}

//
// Interfaces and types regarding the request that fetches the preliminary
// information about the lookup user.
//

export interface LookupUserDataRequest {
  accessToken?: string;
  username: string;
}

export interface LookupUserDataResponse {
  rateLimitInformation: RateLimitInformation;
  lookupUserData: LookupUserData;
}

export type LookupUserDataFetcher = (
  request: LookupUserDataRequest
) => Promise<Result<LookupUserDataResponse, AnyRequestError>>;

//
// Interfaces and types regarding the request that fetches the users that are
// followed by the lookup user (aka. "lookup user followings").
//

export interface FollowedByLookupUserListRequest {
  accessToken?: string;
  lookupUserData: LookupUserData;
}

export interface FollowedByLookupUserListResponse {
  followedByLookupUserList: FollowedByLookupUserList;
}

export type FollowedByLookupUserListFetcher = (
  request: FollowedByLookupUserListRequest
) => Promise<Result<FollowedByLookupUserListResponse, AnyRequestError>>;

//
// Interfaces and types regarding the request that fetches the users that are
// following the lookup user (aka. "lookup user followers").
//

export interface LookupUserFollowerListRequest {
  accessToken?: string;
  lookupUserData: LookupUserData;
}

export interface LookupUserFollowerListResponse {
  lookupUserFollowerList: LookupUserFollowerList;
}

export type LookupUserFollowerListFetcher = (
  request: LookupUserFollowerListRequest
) => Promise<Result<LookupUserFollowerListResponse, AnyRequestError>>;

//
// Common request errors.
//

export interface RequestError {
  id: string;
  status: number;
  message: string;
  responseJSON: unknown;
}

export interface RateLimitRequestError extends RequestError {
  id: 'RateLimitRequestError';
  status: 403;
}

export interface AuthenticationRequestError extends RequestError {
  id: 'AuthenticationRequestError';
  status: 401;
}

export type AnyRequestError =
  | RequestError
  | RateLimitRequestError
  | AuthenticationRequestError;

//
// Basic fetcher contract
//

export interface GitHubAPIRequest {
  accessToken?: string;
  path: string;
  params?: Record<string, string | number>;
}

export interface GitHUbAPIResponse<T> {
  rateLimitInformation: RateLimitInformation;
  data: T;
}

export type GitHubAPIFetcher = <T>(
  request: GitHubAPIRequest
) => Promise<Result<GitHUbAPIResponse<T>, AnyRequestError>>;
