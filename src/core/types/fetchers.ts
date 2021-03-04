import type { PResult } from '../../utils/result';
import type * as core from './core';
import type { InitialUserData } from './core';
import type { AnyApplicationError, AnyFetchError } from './errors';

//
// MainFollowLists
//

export type MainFollowListsFetcher = (
  data: InitialUserData
) => PResult<core.FollowLists, AnyApplicationError>;

//
// LookupUserData
//

export interface LookupUserDataResponse {
  rateLimitInformation: core.RateLimitInformation;
  lookupUserData: core.LookupUserData;
}

export type LookupUserDataFetcher = (
  request: InitialUserData
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
