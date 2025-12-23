import { ReferralTaskType, TaskType } from "@/types/TaskType";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import TaskDrawer from "@/components/TaskDrawer";
import ListItem from "@/components/ListItem";
import Price from "@/components/Price";
import DailyDrawer from "@/components/DailyDrawer";
import CheckIcon from "@/components/icons/CheckIcon";
import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { cn } from "@/lib/utils";
import { uesStore } from "@/store";
import LoadingPage from "@/components/LoadingPage";
import ReferralTaskDrawer from "@/components/ReferralTaskDrawer";

export default function Wallet() {
  const [isReferralTaskDrawerOpen, setIsReferralTaskDrawerOpen] =
    useState(false);
  const [activeReferralTask, setActiveReferralTask] =
    useState<ReferralTaskType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => $http.$get<TaskType[]>("/clicker/tasks"),
  });

  const referralTasks = useQuery({
    queryKey: ["referral-tasks"],
    queryFn: () => $http.$get<ReferralTaskType[]>("/clicker/referral-tasks"),
  });

  const videoTasks = useMemo(
    () => data?.filter((task) => task.type === "video") || [],
    [data]
  );

  const otherTasks = useMemo(
    () => data?.filter((task) => task.type === "other") || [],
    [data]
  );

  if (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">
        <img
          src="/images/wallet.png"
          alt="coins-3"
          className="object-contain w-32 h-32 mx-auto"
        />
        <h1 className="mt-4 text-2xl font-bold text-center uppercase">
          Wallet
        </h1>
        {videoTasks.length > 0 && (
          <>
            <p className="mt-2.5 font-medium text-center">Cool Frog YouTube</p>
            <div className="mt-4 space-y-2">
              {videoTasks.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.name}
                  subtitle={
                    <Price amount={`+${item.reward_coins.toLocaleString()}`} />
                  }
                  image={item.image || "/images/youtube.png"}
                  onClick={() => {
                  }}
                  action={
                    item.is_rewarded ? (
                      <CheckIcon className="w-6 h-6 text-[#27D46C]" />
                    ) : undefined
                  }
                  disabled={item.is_rewarded}
                />
              ))}
            </div>
          </>
        )}
        {/* <p className="mt-8 font-medium text-center">Daily Tasks</p> */}
        <div className="flex gap-3 mt-4">
                  <Button className="flex-1">
                    Depost
                  </Button>
                  <Button className="flex-1">
                    Withdraw
                  </Button>
                </div>
        <div className="mt-4 space-y-2">
          <ListItem
            title={"Daily reward"}
            subtitle={
                <span className="text-sm font-medium text-gray-400">
                    +500 Coins
                </span>
                }
            image="/images/chest.png"
          />
        </div>
        <div className="mt-4 space-y-2">
          <ListItem
            title={"Daily ROI Income"}
            subtitle={
                <span className="text-sm font-medium text-gray-400">
                    +500 Coins
                </span>
                }
            image="/images/chest.png"
          />
        </div>
        <div className="mt-4 space-y-2">
          <ListItem
            title={"Direct Referral Income"}
            subtitle={
                <span className="text-sm font-medium text-gray-400">
                    +500 Coins
                </span>
                }
            image="/images/chest.png"
          />
        </div>
        <div className="mt-4 space-y-2">
          <ListItem
            title={"Salary Reward"}
            subtitle={
                <span className="text-sm font-medium text-gray-400">
                    +500 Coins
                </span>
                }
            image="/images/chest.png"
          />
        </div>
        {otherTasks.length > 0 && (
          <>
            <p className="mt-8 font-medium text-center">All Tasks</p>
            <div className="mt-4 space-y-2">
              {otherTasks.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.name}
                  subtitle={
                    <Price amount={`+${item.reward_coins.toLocaleString()}`} />
                  }
                  image={item.image || "/images/bounty.png"}
                  className={cn(
                    "disabled:opacity-50 disabled:mix-blend-luminosity"
                  )}
                  disabled={item.is_rewarded}
                  action={
                    item.is_rewarded ? (
                      <CheckIcon className="w-6 h-6 text-[#27D46C]" />
                    ) : undefined
                  }
                  onClick={() => {
                  }}
                />
              ))}
            </div>
          </>
        )}
        {referralTasks.data && referralTasks.data?.length > 0 && (
          <>
            <p className="mt-8 font-medium text-center">Referral Tasks</p>
            <div className="mt-4 space-y-2">
              {referralTasks.data.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  subtitle={
                    <Price amount={`+${item.reward.toLocaleString()}`} />
                  }
                  image={"/images/bounty.png"}
                  className={cn(
                    "disabled:opacity-50 disabled:mix-blend-luminosity"
                  )}
                  disabled={!!item.is_completed}
                  action={
                    item.is_completed ? (
                      <CheckIcon className="w-6 h-6 text-[#27D46C]" />
                    ) : undefined
                  }
                  onClick={() => {
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <DailyDrawer
      />
      <TaskDrawer/>

      <ReferralTaskDrawer
      />
    </div>
  );
}
