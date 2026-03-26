import React from "react";
import clsx from "clsx";
import { PaginationProps } from "./Pagination.types";
import { getPaginationRange } from "./pagination.utils";
import { PageSizeSelector } from "./PageSizeSelector";

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
  siblingCount = 1,
}) => {
  const pages = getPaginationRange(currentPage, totalPages, siblingCount);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      
      {/* Page Size */}
      {onPageSizeChange && (
        <PageSizeSelector
          pageSize={pageSize}
          options={pageSizeOptions}
          onChange={onPageSizeChange}
        />
      )}

      {/* Pagination Controls */}
      <nav
        className="flex items-center gap-1"
        role="navigation"
        aria-label="Pagination Navigation"
      >
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={clsx(
                "px-3 py-1 rounded-lg border",
                page === currentPage && "bg-blue-500 text-white"
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
  );
};