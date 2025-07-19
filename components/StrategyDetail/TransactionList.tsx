/** @format */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Transaction } from "@/api/types/dtos";
import { FC, useState } from "react";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "../ui/skeleton";
import {
  Cell,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionToTableValues } from "@/lib/utils";

const getToolTipValue = <TData,>(cell: Cell<TData, unknown>) => {
  const value = cell.getValue();

  if (typeof value === "string") {
    if (value.split(" ").length > 1) {
      // If it's a string with a token, show only the amount
      if (!isNaN(parseFloat(value.split(" ")[0]))) {
        return (
          parseFloat(value.split(" ")[0]).toFixed(2) + " " + value.split(" ")[1]
        );
      }
    }

    if (!isNaN(parseFloat(value))) {
      return parseFloat(value).toFixed(2);
    }
  }

  return value as string;
};

export const TransactionList = () => {
  const { strategyId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  
  const strategyIdString = Array.isArray(strategyId) ? strategyId[0] : strategyId;

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery<
    unknown,
    AxiosError,
    {
      data: Transaction[];
      pagination: {
        totalPages: number;
      };
    }
  >({
    queryKey: ["transactions", strategyIdString, currentPage],
    queryFn: async () => {
      if (!strategyIdString) throw new Error("Strategy ID is required");
      return (
        await api.strategies.getTransactions(strategyIdString, {
          page: currentPage,
          limit: 5,
        })
      ).data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!strategyIdString,
  });

  // Format dates for display

  // Format date and time for tooltips

  console.log(transactionsData);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
            </div>
          ) : error ? (
            error.status === 404 ? (
              <div className="p-4">No transactions available.</div>
            ) : (
              <div className="p-4">Error loading transactions</div>
            )
          ) : transactionsData?.data && transactionsData.data.length > 0 ? (
            <TransactionTable
              data={transactionToTableValues(transactionsData.data)}
            />
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

const TransactionTable: FC<{
  data: ReturnType<typeof transactionToTableValues>;
}> = ({ data }) => {
  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "value", header: "Value" },
    { accessorKey: "price", header: "Price" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Get transaction type styling
  const getTransactionStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "buy":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium";
      case "sell":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {cell.column.id === "type" ? (
                    <span
                      className={getTransactionStyle(cell.getValue() as string)}
                    >
                      {(cell.getValue() as string).toUpperCase()}
                    </span>
                  ) : (
                    <Tooltip>
                      {/* Show low precision value for trigger */}
                      <TooltipTrigger>{getToolTipValue(cell)}</TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
