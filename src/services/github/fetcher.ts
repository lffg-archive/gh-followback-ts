import { URL } from 'url';
import fetch, { Headers } from 'node-fetch';
import { GitHubAPIFetcher, GitHubAPIRequest } from '../../core/types';
import { ok, err, wrapPromise, isErr } from '../../utils/result';

const BASE_GITHUB_API = 'https://api.github.com';

export const gitHubAPIFetcher: GitHubAPIFetcher = async <T>(
  request: GitHubAPIRequest
) => {
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

  return ok(jsonResult.data as T);
};
