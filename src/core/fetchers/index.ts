import { gitHubAPIFetcher } from '../../services/github-api-fetcher';
import { createLookupUserDataFetcher } from './lookup-user-data-fetcher';
import { createLookupUserFollowerListFetcher } from './lookup-user-follower-list-fetcher';
import { createLookupUserFollowingListFetcher } from './lookup-user-following-list-fetcher';
import { createMainFollowListsFetcher } from './main-follow-lists-fetcher';

const commonDeps = {
  gitHubAPIFetcher
};

export const lookupUserDataFetcher = createLookupUserDataFetcher(commonDeps);

export const lookupUserFollowerListFetcher = createLookupUserFollowerListFetcher(
  commonDeps
);

export const lookupUserFollowingListFetcher = createLookupUserFollowingListFetcher(
  commonDeps
);

export const mainFollowListsFetcher = createMainFollowListsFetcher({
  lookupUserDataFetcher,
  lookupUserFollowerListFetcher,
  lookupUserFollowingListFetcher
});
