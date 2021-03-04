export type LookupUserFollowerCount = number;
export type LookupUserFollowingCount = number;

export type FollowList = string[];
export type LookupUserFollowerList = FollowList;
export type LookupUserFollowingList = FollowList;
export interface FollowLists {
  lookupUserFollowerList: LookupUserFollowerList;
  lookupUserFollowingList: LookupUserFollowingList;
}

export type FollowMap = Record<string, number>;

export interface InitialUserData {
  username: string;
  accessToken?: string;
}

export interface LookupUserData {
  username: string;
  lookupUserFollowerCount: LookupUserFollowerCount;
  lookupUserFollowingCount: LookupUserFollowingCount;
}

export interface RateLimitInformation {
  total: number;
  remaining: number;
  reset: Date;
}
