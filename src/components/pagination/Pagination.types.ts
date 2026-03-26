export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];

  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  siblingCount?: number; // pages around current
};