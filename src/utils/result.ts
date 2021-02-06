export type Ok<T> = { status: 'ok'; data: T };
export type Err<E> = { status: 'err'; data: E };

export type AnyResult = Result<unknown, unknown>;
export type Result<T, E> = Ok<T> | Err<E>;

export type ExtractOk<R extends AnyResult, Default = never> = R extends Ok<
  infer OkT
>
  ? OkT
  : Default;
export type ExtractErr<R extends AnyResult, Default = never> = R extends Err<
  infer ErrT
>
  ? ErrT
  : Default;

/**
 * Creates a `Result` in the `ok` variant.
 */
export function ok<T>(data: T): Ok<T> {
  return {
    status: 'ok',
    data
  };
}

/**
 * Creates a `Result` in the `err` variant.
 */
export function err<E>(data: E): Err<E> {
  return {
    status: 'err',
    data
  };
}

/**
 * Checks if the given `Result` is in the `ok` variant.
 */
export function isOk(result: AnyResult): result is Ok<any> {
  return result.status === 'ok';
}

/**
 * Checks if the given `Result` is in the `err` variant.
 */
export function isErr(result: AnyResult): result is Err<any> {
  return result.status === 'err';
}

/**
 * Given a `Result`, returns the data if state is `ok`. Otherwise will throw
 * the data (as it is in a `err` state).
 */
export function unwrap<R extends AnyResult>(result: R): ExtractOk<R> {
  if (isOk(result)) {
    return result.data;
  }

  if (isErr(result)) {
    throw result.data;
  }

  throw new Error('Unreachable.');
}

/**
 * Given a `Result`, returns the data if state is `ok`. Otherwise, will call a
 * callback (with the `err` data) to compute a default value, which must be
 * assignable to the `ok` state data type.
 */
export function unwrapOrElse<
  R extends AnyResult,
  Cb extends (errData: ExtractErr<R>) => ExtractOk<R, any>
>(result: R, cb: Cb): ExtractOk<R, ReturnType<Cb>> {
  if (isOk(result)) {
    return result.data;
  }

  if (isErr(result)) {
    return cb(result.data);
  }

  throw new Error('Unreachable.');
}
