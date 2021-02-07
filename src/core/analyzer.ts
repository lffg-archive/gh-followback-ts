import type { FollowLists, FollowMap } from './types';

export enum FollowStatus {
  /**
   * Determine if the current user **is following** the lookup user.
   * E.g.: Bob follows lookup user.
   *
   * Correspondent core type: `LookupUserFollower*`.
   */
  IS_FOLLOWING_LOOKUP_USER = 0b01,

  /**
   * Determines if the current user is **followed by** the lookup user.
   * E.g.: Lookup user follows Bob.
   *
   * Correspondent core type: `LookupUserFollowing*`.
   */
  IS_FOLLOWED_BY_LOOKUP_USER = 0b10,

  /**
   * Determines if the lookup user follows and is followed by the current user.
   *
   * Correspondents core types: `LookupUserFollower*` **and**
   * `LookupUserFollowing*`.
   */
  BOTH = IS_FOLLOWING_LOOKUP_USER | IS_FOLLOWED_BY_LOOKUP_USER
}

/**
 * Generate a following/follower map.
 * The returned "map" is an object with null prototype.
 */
export function createFollowMap({
  lookupUserFollowerList,
  lookupUserFollowingList
}: FollowLists): FollowMap {
  const map: FollowMap = Object.create(null);

  for (const lookupUserFollower of lookupUserFollowerList) {
    map[lookupUserFollower] |= FollowStatus.IS_FOLLOWING_LOOKUP_USER;
  }

  for (const lookupUserFollowing of lookupUserFollowingList) {
    map[lookupUserFollowing] |= FollowStatus.IS_FOLLOWED_BY_LOOKUP_USER;
  }

  return map;
}
