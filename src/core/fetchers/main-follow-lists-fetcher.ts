import { err, isErr, ok } from '../../utils/result';
import * as fetchers from '../types/fetchers';
import { mapFetchErrorToApplicationError } from './internal/map-fetch-error-to-application-error';
import { computePaginationInfo } from './internal/pagination';

interface Deps {
  lookupUserDataFetcher: fetchers.LookupUserDataFetcher;
  lookupUserFollowerListFetcher: fetchers.LookupUserFollowerListFetcher;
  lookupUserFollowingListFetcher: fetchers.LookupUserFollowingListFetcher;
}

export function createMainFollowListsFetcher(
  deps: Deps
): fetchers.MainFollowListsFetcher {
  return async function mainFollowListsFetcher(fetcherData) {
    const lookupUserDataResult = await deps.lookupUserDataFetcher(fetcherData);

    if (isErr(lookupUserDataResult)) {
      return err(mapFetchErrorToApplicationError(lookupUserDataResult.data));
    }

    const { lookupUserData, rateLimitInformation } = lookupUserDataResult.data;

    const followersPaginationInfo = computePaginationInfo(
      lookupUserData.lookupUserFollowerCount
    );
    const followingPaginationInfo = computePaginationInfo(
      lookupUserData.lookupUserFollowingCount
    );

    const total = followersPaginationInfo.pages + followingPaginationInfo.pages;
    const available = rateLimitInformation.remaining;

    if (total > available) {
      return err({
        code: 'TooSmallRateLimitQuotaError',
        available,
        totalRequired: total
      });
    }

    const fetchData = { lookupUserData };
    const followerListPromise = deps.lookupUserFollowerListFetcher(fetchData);
    const followingListPromise = deps.lookupUserFollowingListFetcher(fetchData);
    const followerListResult = await followerListPromise;
    const followingListResult = await followingListPromise;

    if (isErr(followerListResult)) {
      return err(mapFetchErrorToApplicationError(followerListResult.data));
    }
    if (isErr(followingListResult)) {
      return err(mapFetchErrorToApplicationError(followingListResult.data));
    }

    return ok({
      lookupUserFollowerList: followerListResult.data.lookupUserFollowerList,
      lookupUserFollowingList: followingListResult.data.lookupUserFollowingList
    });
  };
}
