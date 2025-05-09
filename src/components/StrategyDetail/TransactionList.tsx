/** @format */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Transaction } from "@/api/types/dtos";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";

export const TransactionList = () => {
  const { strategyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery<
    any,
    AxiosError,
    {
      data: Transaction[];
      pagination: {
        totalPages: number;
      };
    }
  >({
    queryKey: ["transactions", strategyId, currentPage],
    queryFn: async () => {
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

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Get transaction type label and color
  const getTransactionType = (type: string) => {
    switch (type.toLowerCase()) {
      case "buy":
        return { label: "Buy", color: "bg-green-100 text-green-800" };
      case "sell":
        return { label: "Sell", color: "bg-red-100 text-red-800" };
      default:
        return { label: type, color: "bg-slate-100 text-slate-800" };
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4">Loading transactions...</div>
          ) : error ? (
            error.status === 404 ? (
              <div className="p-4">No transactions available.</div>
            ) : (
              <div className="p-4">Error loading transactions</div>
            )
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
                {transactionsData.data.map((transaction, index) => {
                  const type = getTransactionType(transaction.type);
                  return (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="py-4 px-5 text-slate-700">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${type.color}`}
                        >
                          {type.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-700">
                        {transaction.amount.toFixed(4)}{" "}
                        {transaction.tokenSymbol}
                      </td>
                      <td className="py-4 px-5 text-slate-700">
                        {formatCurrency(transaction.price)}
                      </td>
                      <td className="py-4 px-5 text-right text-slate-700">
                        {formatCurrency(transaction.amount * transaction.price)}
                      </td>
                    </tr>
                  );
                })}
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
