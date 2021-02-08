import { isErr, ok } from '../../utils/result';
import type { LookupUserFollowingListFetcher } from '../types/fetcher';
import type { GitHubAPIFetcher } from '../types/github-adapter';
import { fetchPagedFollowList } from './internal/fetch-paged-follow-list';

interface Deps {
  gitHubAPIFetcher: GitHubAPIFetcher;
}

export function createLookupUserFollowingListFetcher({
  gitHubAPIFetcher
}: Deps): LookupUserFollowingListFetcher {
  type GHResponse = Array<{
    login: string;
  }>;

  return async function lookupUserFollowingListFetcher(request) {
    const result = await fetchPagedFollowList({
      gitHubAPIFetcher,
      path: `/users/${request.lookupUserData.username}/following`,
      accessToken: request.accessToken,
      followListCount: request.lookupUserData.lookupUserFollowerCount
    });

    if (isErr(result)) {
      return result;
    }

    return ok({
      lookupUserFollowingList: result.data
    });
  };
}
