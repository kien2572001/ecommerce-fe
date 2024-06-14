import React from "react";

function Pagination({ prev, currentPage, next, pages, handleActive }) {
  const getPaginationGroup = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pages, currentPage + 2);

    if (currentPage <= 3) {
      startPage = 1;
      endPage = Math.min(pages, 5);
    }

    if (currentPage > pages - 3) {
      startPage = Math.max(1, pages - 4);
      endPage = pages;
    }

    const pagesToShow = [];

    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    if (startPage > 1) {
      pagesToShow.unshift("...");
      pagesToShow.unshift(1);
    }

    if (endPage < pages) {
      pagesToShow.push("...");
      pagesToShow.push(pages);
    }

    return pagesToShow;
  };

  const paginationGroup = getPaginationGroup();

  return (
    <>
      <ul className="pagination justify-content-start">
        {paginationGroup.length <= 0 ? null : (
          <li onClick={prev} className="page-item">
            {currentPage === 1 ? null : (
              <a className="page-link">
                <i className="fi-rs-angle-double-small-left"></i>
              </a>
            )}
          </li>
        )}

        {paginationGroup.map((item, index) => (
          <li
            onClick={() => {
              if (item !== "...") handleActive(item);
            }}
            key={index}
            className={currentPage === item ? "page-item active" : "page-item"}
          >
            <a className="page-link">{item}</a>
          </li>
        ))}

        {paginationGroup.length <= 0 ? null : (
          <li onClick={next} className="page-item">
            {currentPage >= pages ? null : (
              <a className="page-link">
                <i className="fi-rs-angle-double-small-right"></i>
              </a>
            )}
          </li>
        )}
      </ul>

      {paginationGroup.length <= 0 ? null : (
        <p>
          show {currentPage} of {pages}
        </p>
      )}
    </>
  );
}

export default Pagination;
