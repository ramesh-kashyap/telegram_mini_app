import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import LoadingPage from "@/components/LoadingPage";

type LevelUser = {
  id: number;
  first_name: string;
  last_name: string | null;
  package: number;
  active_status: string;
  created_at: string;
};

export default function LevelUsers() {
  const { level } = useParams();
const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["level-users", level],
    queryFn: () =>
      $http.$get<{ data: LevelUser[] }>("/team/level-users", {
        params: { level },
      }),
    enabled: !!level,
  });

 
 if (isLoading) return <LoadingPage />;

  const users = data?.data ?? [];

  if (users.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No users found on this level
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 px-6 py-6 pb-24 mt-12 modal-body">
         {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 rounded-lg bg-[#1b1b1b]"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">
            Level {level} Members
          </h1>
        </div>

        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center bg-[#1b1b1b] p-4 rounded-xl"
            >
              {/* LEFT */}
              <div>
                <p className="font-semibold">
                  {u.first_name} {u.last_name ?? ""}
                </p>
                <p className="text-xs text-gray-400">
                  Joined:{" "}
                  {new Date(u.created_at).toLocaleDateString()}{" "}
                  {new Date(u.created_at).toLocaleTimeString()}
                </p>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-sm font-bold text-[#27D46C]">
                  {u.package.toLocaleString()} USDT
                </p>
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    u.active_status === "Active"
                      ? "bg-green-600"
                      : "bg-gray-600"
                  )}
                >
                  {u.active_status === "Active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}