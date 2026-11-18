"use client";

import { useEffect, useState } from "react";
import WorkerCard from "@/components/WorkerCard";
import { Worker } from "@/types/types";




const ITEMS_PER_PAGE = 10;

interface WorkersListWithPaginationProps {
  workers: Worker[];
}

const WorkersListWithPagination: React.FC<
  WorkersListWithPaginationProps
> = ({ workers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [workers]);

  const totalPages = Math.ceil(
    workers.length / ITEMS_PER_PAGE
  );

  const paginatedWorkers = workers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {paginatedWorkers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-200 rounded ${
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-200 rounded ${
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default WorkersListWithPagination;