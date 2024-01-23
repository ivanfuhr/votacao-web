export type Metadata = {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number;
  next: number;
};

export type PaginateResponse<T> = {
  data: T[];
  meta: Metadata;
};
