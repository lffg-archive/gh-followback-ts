import { gitHubAPIFetcher } from '../../services/github-api-fetcher';
import * as Fetcher from './fetchers';

const commonDeps = {
  gitHubAPIFetcher
};

export const lookupUserDataFetcher = Fetcher.createLookupUserDataFetcher(
  commonDeps
);

export const lookupUserFollowerListFetcher = Fetcher.createLookupUserFollowerListFetcher(
  commonDeps
);

export const lookupUserFollowingListFetcher = Fetcher.createLookupUserFollowingListFetcher(
  commonDeps
);
