import { useState } from "react";

const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);

  const goToNextPage = () =>
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const goToPreviousPage = () =>
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  const setPageNumber = (pageNumber) =>
    setPage(Math.max(Math.min(pageNumber, totalPages), 1));
  const setLimitPerPage = (newLimit) => setLimit(newLimit);
  const setTotal = (total) => setTotalPages(Math.max(total, 1));

  return {
    page,
    limit,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setPageNumber,
    setLimitPerPage,
    setTotalPages: setTotal,
  };
};

export default usePagination;
