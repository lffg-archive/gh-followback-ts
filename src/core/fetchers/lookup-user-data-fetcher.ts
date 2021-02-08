import { isErr, ok } from '../../utils/result';
import type { LookupUserDataFetcher } from '../types/fetcher';
import type { GitHubAPIFetcher } from '../types/github-adapter';

interface Deps {
  gitHubAPIFetcher: GitHubAPIFetcher;
}

export function createLookupUserDataFetcher({
  gitHubAPIFetcher
}: Deps): LookupUserDataFetcher {
  interface GHResponse {
    login: string;
    followers: number;
    following: number;
  }

  return async function lookupUserDataFetcher(request) {
    const result = await gitHubAPIFetcher<GHResponse>({
      path: `/users/${request.username}`,
      accessToken: request.accessToken
    });

    if (isErr(result)) {
      return result;
    }

    const { data, rateLimitInformation } = result.data;

    return ok({
      lookupUserData: {
        username: data.login,
        lookupUserFollowerCount: data.followers,
        lookupUserFollowingCount: data.following
      },
      rateLimitInformation
    });
  };
}
