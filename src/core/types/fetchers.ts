import type { PResult } from '../../utils/result';
import type * as core from './core';
import type { AnyFetchError } from './errors';

//
// LookupUserData
//

export interface LookupUserDataRequest {
  accessToken?: string;
  username: string;
}

export interface LookupUserDataResponse {
  rateLimitInformation: core.RateLimitInformation;
  lookupUserData: core.LookupUserData;
}

export type LookupUserDataFetcher = (
  request: LookupUserDataRequest
) => PResult<LookupUserDataResponse, AnyFetchError>;

//
// LookupUserFollowerList
//

export interface LookupUserFollowerListRequest {
  accessToken?: string;
  lookupUserData: core.LookupUserData;
}

export interface LookupUserFollowerListResponse {
  lookupUserFollowerList: core.LookupUserFollowerList;
}

export type LookupUserFollowerListFetcher = (
  request: LookupUserFollowerListRequest
) => PResult<LookupUserFollowerListResponse, AnyFetchError>;

//
// LookupUserFollowingList
//

export interface LookupUserFollowingListRequest {
  accessToken?: string;
  lookupUserData: core.LookupUserData;
}

export interface LookupUserFollowingListResponse {
  lookupUserFollowingList: core.LookupUserFollowingList;
}

export type LookupUserFollowingListFetcher = (
  request: LookupUserFollowingListRequest
) => PResult<LookupUserFollowingListResponse, AnyFetchError>;
