import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { $http } from "@/lib/http";
import LoadingPage from "@/components/LoadingPage";
import { HistoryType } from "@/types/UserType";

export default function History() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["history", page],
    queryFn: () =>
      $http.$get<{
        data: HistoryType[];
        current_page: number;
        last_page: number;
      }>("/history", {
        params: { page, per_page: 6 },
      }),
  });

  function WalletIcon({ className = "w-6 h-6" }) {
    return (
      <img
        src="/images/icons8-wallet-64.png"
        className={className}
        alt="wallet"
      />
    );
  }

  if (isLoading) return <LoadingPage />;

  const history: HistoryType[] = Array.isArray(data?.data)
    ? data!.data
    : [];

  const totalPages = data?.last_page ?? 1;

  /**
   * Withdraw & Buy Package => NEGATIVE
   */
  const isNegative = (type: string) => {
    return (
      type.toLowerCase().includes("withdraw") ||
      type.toLowerCase().includes("buy package")
    );
  };

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center uppercase">
          History
        </h1>

        {/* HISTORY LIST */}
        <div className="mt-6 space-y-3">
          {history.length === 0 && (
            <p className="text-center text-gray-400">
              No history found
            </p>
          )}

          {history.map((item) => {
            const negative = isNegative(item.type);

            return (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center justify-between p-4 bg-[#1b1b1b] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <WalletIcon />

                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-xs text-gray-400">
                     {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "font-bold",
                    negative ? "text-red-500" : "text-[#27D46C]"
                  )}
                >
                  {negative ? "-" : "+"}
                  {item.amount} {item.token}
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={cn(
              "px-4 py-2 rounded-lg font-semibold",
              page === 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#1b1b1b] border border-[#27D46C] text-[#27D46C]"
            )}
          >
            Prev
          </button>

          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={cn(
              "px-4 py-2 rounded-lg font-semibold",
              page === totalPages
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#27D46C] text-black"
            )}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}