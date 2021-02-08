import { PResult } from '../utils/result';

//
// Main types.
//

export type LookupUserFollowerList = string[];
export type LookupUserFollowingList = string[];

export type LookupUserFollowerCount = number;
export type LookupUserFollowingCount = number;

export interface FollowLists {
  lookupUserFollowerList: LookupUserFollowerList;
  lookupUserFollowingList: LookupUserFollowingList;
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
  lookupUserFollowerCount: LookupUserFollowerCount;
  lookupUserFollowingCount: LookupUserFollowingCount;
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
) => PResult<LookupUserDataResponse, AnyRequestError>;

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
) => PResult<LookupUserFollowerListResponse, AnyRequestError>;

//
// Interfaces and types regarding the request that fetches the users that are
// followed by the lookup user (aka. "lookup user followings").
//

export interface LookupUserFollowingListRequest {
  accessToken?: string;
  lookupUserData: LookupUserData;
}

export interface LookupUserFollowingListResponse {
  lookupUserFollowingList: LookupUserFollowingList;
}

export type LookupUserFollowingListFetcher = (
  request: LookupUserFollowingListRequest
) => PResult<LookupUserFollowingListResponse, AnyRequestError>;

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
// Basic fetcher contract.
//

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
) => PResult<GitHUbAPIResponse<T>, AnyRequestError>;
