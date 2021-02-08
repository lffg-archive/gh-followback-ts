import { gitHubAPIFetcher } from '../../services/github/fetcher';
import * as Fetcher from './fetcher';

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
