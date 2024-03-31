import React from 'react'

function Pagination({ totalPages,currentPage, setCurrentPage }) {
  return (
    <>
      {totalPages.length > 0 && <p className="my-1">Pages</p>}

      {totalPages.length <= 10 || totalPages.length <= 13
        ? totalPages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => {
                setCurrentPage(page);
              }}
              className={`bg-gray-200 py-1 px-2 mx-1 rounded-sm ${
                page === currentPage && "bg-green-500"
              }`}
            >
              {page}
            </button>
          ))
        : totalPages.length > 13 &&
          totalPages.map((page) => {
            return (
              <>
                {page <= 10 && (
                  <button
                    key={page}
                    type="button"
                    onClick={() => {
                      setCurrentPage(page);
                    }}
                    className={`bg-gray-200 py-1 px-2 mx-1 rounded-sm ${
                      page === currentPage && "bg-green-500"
                    }`}
                  >
                    {page}
                  </button>
                )}
                {page === totalPages.length - 1 && (
                  <>
                    "..."{" "}
                    <button
                      key={page}
                      type="button"
                      onClick={() => {
                        setCurrentPage(page);
                      }}
                      className={`bg-gray-200 py-1 px-2 mx-1 rounded-sm ${
                        page === currentPage && "bg-green-500"
                      }`}
                    >
                      {page}
                    </button>
                  </>
                )}
                ;
              </>
            );
          })}
    </>
  );
}

export default Pagination