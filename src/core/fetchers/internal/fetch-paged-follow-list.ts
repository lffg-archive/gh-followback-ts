import * as pLimit from 'p-limit';
import { isErr, ok, packResults, PResult } from '../../../utils/result';
import type { AnyFetchError } from '../../types/errors';
import { GitHubAPIFetcher } from '../../types/github-adapter';
import { CONCURRENCY_LIMIT } from './constants';
import { computePaginationInfo } from './pagination';

interface FetchPagedFollowListData {
  gitHubAPIFetcher: GitHubAPIFetcher;
  path: string;
  accessToken?: string;
  followListCount: number;
}

export async function fetchPagedFollowList({
  gitHubAPIFetcher,
  path,
  accessToken,
  followListCount
}: FetchPagedFollowListData): PResult<string[], AnyFetchError> {
  const { pages, perPageCount } = computePaginationInfo(followListCount);

  const createFetch = (page: number) =>
    gitHubAPIFetcher<Array<{ login: string }>>({
      path,
      accessToken,
      queryParams: {
        per_page: perPageCount.toString(),
        page: page.toString()
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
