import type { FollowLists, FollowMap } from './types';

export enum FollowStatus {
  /**
   * Determines if the current user is **followed by** the lookup user.
   * E.g.: Lookup user follows Bob.
   */
  IS_FOLLOWED_BY_LOOKUP_USER = 0b01,

  /**
   * Determine if the current user **is following** the lookup user.
   * E.g.: Bob follows lookup user.
   */
  IS_FOLLOWING_LOOKUP_USER = 0b10,

  /**
   * Determines if the lookup user follows and is followed by the current user.
   */
  BOTH = IS_FOLLOWED_BY_LOOKUP_USER | IS_FOLLOWING_LOOKUP_USER
}

/**
 * Generate a following/follower map.
 * The returned "map" is an object with null prototype.
 *
 * @param followedByLookupUserList Users that are *followed by* the lookup user.
 * @param lookupUserFollowerList Users that *are following* the lookup user.
 */
export function createFollowMap({
  followedByLookupUserList,
  lookupUserFollowerList
}: FollowLists): FollowMap {
  const map: FollowMap = Object.create(null);

  for (const followedByLookupUser of followedByLookupUserList) {
    map[followedByLookupUser] |= FollowStatus.IS_FOLLOWED_BY_LOOKUP_USER;
  }

  for (const lookupUserFollower of lookupUserFollowerList) {
    map[lookupUserFollower] |= FollowStatus.IS_FOLLOWING_LOOKUP_USER;
  }

  return map;
}
