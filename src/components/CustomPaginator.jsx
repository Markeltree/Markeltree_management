import React from "react";

const CustomPaginator = ({
  totalPages,
  currentPage = 0,
  onPageChange,
  maxButtons = 5,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const toDisplay = (index) => index + 1;

  const handleClick = (pageIndex) => {
    if (pageIndex === currentPage) return;
    onPageChange(pageIndex);
  };

  const buildPages = () => {
    const pages = [];
    if (totalPages <= maxButtons) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
      return pages;
    }

    const windowSize = Math.max(1, maxButtons - 2);
    let start = currentPage - Math.floor(windowSize / 2);
    let end = currentPage + Math.floor(windowSize / 2);

    if (start < 1) {
      start = 1;
      end = start + windowSize - 1;
    }
    if (end > totalPages - 2) {
      end = totalPages - 2;
      start = end - (windowSize - 1);
    }

    pages.push(0);

    if (start > 1) pages.push("left-ellipsis");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 2) pages.push("right-ellipsis");

    pages.push(totalPages - 1);

    return pages;
  };

  const pageItems = buildPages();

  const activeCircle =
    "flex items-center justify-center rounded-full bg-[#09BF64] text-white dark:text-[#0D0D0D] w-6 h-6 text-xs";
  const inactiveText = "text-[#666666] dark:text-[#B5E6C9] text-xs sm:text-sm";
  const navButton = "text-[#666666] text-sm px-1 hover:text-[#09BF64]";

  return (
    <nav
      className="flex items-center justify-center gap-6 mt-3"
      aria-label="Pagination"
    >
      {/* First */}
      <button
        type="button"
        onClick={() => handleClick(0)}
        disabled={currentPage === 0}
        className={`${navButton} ${currentPage === 0 ? "opacity-40" : ""}`}
      >
        «
      </button>

      {/* Prev */}
      <button
        type="button"
        onClick={() => handleClick(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className={`${navButton} ${currentPage === 0 ? "opacity-40" : ""}`}
      >
        ‹
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-6">
        {pageItems.map((p, idx) =>
          typeof p === "string" ? (
            <span key={`e${idx}`} className="px-1 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => handleClick(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={p === currentPage ? activeCircle : inactiveText}
            >
              {toDisplay(p)}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        onClick={() => handleClick(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className={`${navButton} ${
          currentPage === totalPages - 1 ? "opacity-40" : ""
        }`}
      >
        ›
      </button>

      {/* Last */}
      <button
        type="button"
        onClick={() => handleClick(totalPages - 1)}
        disabled={currentPage === totalPages - 1}
        className={`${navButton} ${
          currentPage === totalPages - 1 ? "opacity-40" : ""
        }`}
      >
        »
      </button>
    </nav>
  );
};

export default CustomPaginator;
