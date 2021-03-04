import { PER_PAGE_COUNT } from './constants';

export interface PaginationInfo {
  pages: number;
  perPageCount: number;
}

export function computePaginationInfo(followListCount: number): PaginationInfo {
  const perPageCount = PER_PAGE_COUNT;
  const pages = Math.ceil(followListCount / perPageCount);

  return {
    pages,
    perPageCount
  };
}
