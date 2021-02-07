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
  username: string;
}

export interface LookupUserDataResponse {
  rateLimitInformation: RateLimitInformation;
  lookupUserData: LookupUserData;
}

export type LookupUserDataFetcher = (
  request: LookupUserDataRequest
) => Promise<Result<LookupUserDataResponse, Error>>;

//
// Interfaces and types regarding the request that fetches the users that are
// followed by the lookup user (aka. "lookup user followings").
//

export interface FollowedByLookupUserListRequest {
  lookupUserData: LookupUserData;
}

export interface FollowedByLookupUserListResponse {
  followedByLookupUserList: FollowedByLookupUserList;
}

export type FollowedByLookupUserListFetcher = (
  request: FollowedByLookupUserListRequest
) => Promise<Result<FollowedByLookupUserListResponse, Error>>;

//
// Interfaces and types regarding the request that fetches the users that are
// following the lookup user (aka. "lookup user followers").
//

export interface LookupUserFollowerListRequest {
  lookupUserData: LookupUserData;
}

export interface LookupUserFollowerListResponse {
  lookupUserFollowerList: LookupUserFollowerList;
}

export type LookupUserFollowerListFetcher = (
  request: LookupUserFollowerListRequest
) => Promise<Result<LookupUserFollowerListResponse, Error>>;
