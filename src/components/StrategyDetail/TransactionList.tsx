/** @format */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const TransactionList = () => {
  const { strategyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions", strategyId, currentPage],
    queryFn: async () => {
      if (!strategyId) throw new Error("Strategy ID is required");
      return (
        await api.strategies.getTransactions(strategyId, {
          page: currentPage,
          limit: 5,
        })
      ).data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!strategyId,
  });

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4">Loading transactions...</div>
          ) : error ? (
            <div className="p-4 text-red-500">
              Error loading transactions: {error.message}
            </div>
          ) : transactionsData?.data && transactionsData.data.length > 0 ? (
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-4 px-5 font-medium text-slate-500">
                    Date
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-500">
                    Type
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-500">
                    Amount
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-500">
                    Price
                  </th>
                  <th className="text-right py-4 px-5 font-medium text-slate-500">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.data.map((transaction, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-4 px-5 text-slate-700">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-700">
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-5 text-slate-700">
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-5 text-right text-slate-700">
                      {transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4">No transactions available.</div>
          )}
        </div>
        <div className="flex justify-between items-center p-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {transactionsData?.pagination.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={
              currentPage === (transactionsData?.pagination.totalPages || 1)
            }
            onClick={() =>
              setCurrentPage(
                Math.min(
                  currentPage + 1,
                  transactionsData?.pagination.totalPages || 1
                )
              )
            }
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
};
