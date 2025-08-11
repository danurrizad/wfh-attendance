import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import LimitPage from "./LimitPage";

const Pagination = ({
  page,
  totalPage,
  onPageChange,

  showLimit,
  limit,
  options,
  onLimitChange,
}) => {
  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPage) },
    (_, i) => i + Math.max(page - 1, 1)
  );

  return (
    <div className="flex justify-center gap-5">
      <div className="flex items-center ">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1 || totalPage === 0}
          className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50  text-sm"
        >
          <FontAwesomeIcon icon={faChevronLeft}/>
          <FontAwesomeIcon icon={faChevronLeft}/>
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || totalPage === 0}
          className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50  text-sm"
        >
          <FontAwesomeIcon icon={faChevronLeft}/>
        </button>
        <div className="flex items-center gap-2">
          {page > 3 && <span className="px-2">...</span>}
          {pagesAroundCurrent.map((page) => {
            if(page <= totalPage){
              return(
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded ${
                    page === page
                      ? "bg-sky-500  text-white"
                      : "text-gray-700 "
                  } flex w-10 items-center justify-center h-10 rounded-lg text-sm font-medium ${page !== page && "hover:bg-sky-500/[0.2] hover:text-sky-500 "}`}
                >
                  {page}
                </button>
              )}
            }
          )}
          {page < totalPage - 2 && <span className="px-2">...</span>}
        </div>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPage || totalPage === 0}
          className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 "
        >
          <FontAwesomeIcon icon={faChevronRight}/>
        </button>
        <button
          onClick={() => onPageChange(totalPage)}
          disabled={page === totalPage || totalPage === 0}
          className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs text-sm hover:bg-gray-50 h-10 disabled:opacity-50 "
        >
          <FontAwesomeIcon icon={faChevronRight}/>
          <FontAwesomeIcon icon={faChevronRight}/>
        </button>
      </div>
      { showLimit && (
        <LimitPage
          onChangeLimit={onLimitChange}
          limit={limit}
          options={options || []}
        />
      )}
    </div>
  );
};

export default Pagination;
