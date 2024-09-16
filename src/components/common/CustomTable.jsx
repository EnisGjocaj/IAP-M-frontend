// src/components/CustomTable.js
import React from 'react';

const CustomTable = ({ headers, data, onDelete, onEdit }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-xs font-light border-collapse">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 text-xs sm:text-sm">
                      {header}
                    </th>
                  ))}
                  {(onDelete || onEdit) && (
                    <th className="px-2 py-1 sm:px-4 sm:py-2 bg-gray-200 text-xs sm:text-sm">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                    >
                      {Object.values(row).map((cell, idx) => (
                        <td
                          key={idx}
                          className="whitespace-nowrap px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm"
                        >
                          {cell}
                        </td>
                      ))}
                      {(onDelete || onEdit) && (
                        <td className="py-1 px-2 sm:px-3 text-xs sm:text-sm">
                          {onEdit && (
                            <button
                              className="text-blue-600 hover:underline px-1"
                              onClick={() => onEdit(row.id)}
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="text-red-600 hover:underline px-1 ml-2"
                              onClick={() => onDelete(row.id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length + (onDelete || onEdit ? 1 : 0)} className="px-2 py-1 sm:px-4 sm:py-2 text-center text-gray-500 text-xs sm:text-sm">
                      Currently no data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CustomTable;
