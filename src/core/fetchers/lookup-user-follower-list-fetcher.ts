import { isErr, ok } from '../../utils/result';
import type { LookupUserFollowerListFetcher } from '../types/fetcher';
import type { GitHubAPIFetcher } from '../types/github-adapter';
import { fetchPagedFollowList } from './internal/fetch-paged-follow-list';

interface Deps {
  gitHubAPIFetcher: GitHubAPIFetcher;
}

export function createLookupUserFollowerListFetcher({
  gitHubAPIFetcher
}: Deps): LookupUserFollowerListFetcher {
  return async function lookupUserFollowerListFetcher(request) {
    const result = await fetchPagedFollowList({
      gitHubAPIFetcher,
      path: `/users/${request.lookupUserData.username}/followers`,
      accessToken: request.accessToken,
      followListCount: request.lookupUserData.lookupUserFollowerCount
    });

    if (isErr(result)) {
      return result;
    }

    return ok({
      lookupUserFollowerList: result.data
    });
  };
}
