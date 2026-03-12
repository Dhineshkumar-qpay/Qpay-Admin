import React, { useState, useMemo } from "react";
import "../styles/data_table.css";

function DataTable({
  columns = [],
  data = [],
  loading = false,
  pageSize = 10,
  renderRow,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="data-table-empty">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table-empty">
                  No Data Found
                </td>
              </tr>
            ) : renderRow ? (
              paginatedData.map((row, index) => renderRow(row, index))
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages !== 0 && (
        <div className="data-table-pagination">
          <span className="data-table-pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <div>
            <button
              className="data-table-btn"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className="data-table-btn"
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  backgroundColor:
                    currentPage === index + 1 ? "#06433e" : "#ffffff",
                  color: currentPage === index + 1 ? "#fff" : "",
                }}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="data-table-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
