import { URL } from 'url';
import fetch, { Headers } from 'node-fetch';
import { AnyFetchError } from '../core/types/errors';
import type {
  GitHubAPIRequest,
  GitHubAPIResponse
} from '../core/types/github-adapter';
import { ok, err, wrapPromise, isErr, PResult } from '../utils/result';

const BASE_GITHUB_API = 'https://api.github.com';

export async function gitHubAPIFetcher<T>(
  request: GitHubAPIRequest
): PResult<GitHubAPIResponse<T>, AnyFetchError> {
  const { path, accessToken, queryParams } = request;

  const url = new URL(path, BASE_GITHUB_API);
  for (const [key, val] of Object.entries(queryParams || {})) {
    url.searchParams.append(key, val);
  }

  const headers = new Headers({
    accept: 'application/vnd.github.v3+json'
  });
  if (accessToken) {
    headers.append('authorization', `token ${accessToken}`);
  }

  const responseResult = await wrapPromise(
    fetch(url, {
      headers
    })
  );

  if (isErr(responseResult)) {
    return err({
      code: 'RequestProcessingError',
      message: 'Unknown request error',
      errorObject: responseResult.data
    });
  }

  const response = responseResult.data;
  const jsonResult = await wrapPromise<any>(response.json());

  if (isErr(jsonResult)) {
    return err({
      code: 'RequestProcessingError',
      message: 'Error while parsing the request response as JSON',
      errorObject: jsonResult.data
    });
  }

  const json = jsonResult.data;

  if (!response.ok) {
    // If the `accessToken` was invalid (aka. unauthenticated).
    if (response.status === 401) {
      return err({
        code: 'AuthenticationRequestError',
        status: 401,
        message: (json.message as string) || '',
        responseJSON: json
      });
    }

    // If the rate limit was exceeded.
    if (response.status === 403 && json.message === '') {
      return err({
        code: 'RateLimitRequestError',
        status: 403,
        message: (json.message as string) || '',
        responseJSON: json
      });
    }

    // Generic error case.
    return err({
      code: 'RequestUnknownError',
      status: response.status,
      responseJSON: json
    });
  }

  const getH = (name: string, fallback: { toString(): string }) =>
    response.headers.get(name) ?? fallback.toString();

  return ok({
    data: json,
    rateLimitInformation: {
      total: parseInt(getH('x-ratelimit-limit', 60), 10),
      remaining: parseInt(getH('x-ratelimit-remaining', 0), 10),

      // The `* 1000` is needed because the JavaScript `Date` type uses a
      // timestamp with milliseconds precision. GitHub API returns a timestamp
      // with seconds precision.
      reset: new Date(parseInt(getH('x-ratelimit-remaining', 0), 10) * 1000)
    }
  });
}
