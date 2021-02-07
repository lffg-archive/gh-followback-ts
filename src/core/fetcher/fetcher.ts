import * as pLimit from 'p-limit';
import { ok, isErr, packResults, PResult } from '../../utils/result';
import type * as T from '../types';

const PER_PAGE_COUNT = 100;
const CONCURRENCY_LIMIT = 5;

interface CommonDeps {
  gitHubAPIFetcher: T.GitHubAPIFetcher;
}

export function createLookupUserDataFetcher({
  gitHubAPIFetcher
}: CommonDeps): T.LookupUserDataFetcher {
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

export function createLookupUserFollowerListFetcher({
  gitHubAPIFetcher
}: CommonDeps): T.LookupUserFollowerListFetcher {
  return async function lookupUserFollowerListFetcher(request) {
    const result = await followListsFetcherAbstraction({
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

export function createLookupUserFollowingListFetcher({
  gitHubAPIFetcher
}: CommonDeps): T.LookupUserFollowingListFetcher {
  type GHResponse = Array<{
    login: string;
  }>;

  return async function lookupUserFollowingListFetcher(request) {
    const result = await followListsFetcherAbstraction({
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

//
// Private module functions.
//

interface FetcherData {
  gitHubAPIFetcher: T.GitHubAPIFetcher;
  path: string;
  accessToken?: string;
  followListCount: number;
}

async function followListsFetcherAbstraction(
  $data: FetcherData
): PResult<string[], T.AnyRequestError> {
  const pages = Math.ceil($data.followListCount / PER_PAGE_COUNT);

  const createFetch = (page: number) =>
    $data.gitHubAPIFetcher<Array<{ login: string }>>({
      path: $data.path,
      accessToken: $data.accessToken,
      params: {
        per_page: PER_PAGE_COUNT,
        page
      }
    });

  const limit = pLimit(CONCURRENCY_LIMIT);
  const promises = Array.from({ length: pages }).map((_, i) =>
    limit(() => createFetch(i + 1))
  );

  const result = packResults(await Promise.all(promises));

  if (isErr(result)) {
    return result;
  }

  const followList = result.data.flatMap((response) =>
    response.data.map((user) => user.login)
  );

  return ok(followList);
}
