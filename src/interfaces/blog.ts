export interface IAPIListingQuery {
  limit?: number;
  page?: number;
  search?: string;
  order?: "DESC" | "ASC";
  sort?: string;
}

export interface PaginateChild {
  page: number;
}

export interface PaginateResponse<T> {
  result?: T[];
  next?: PaginateChild;
  previous?: PaginateChild;
  limit?: number;
  totalElements?: number;
  totalPages?: number;
}
