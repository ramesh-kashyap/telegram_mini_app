import UserTap from "../components/UserTap";
import { useUserStore } from "../store/user-store";
import { Link } from "react-router-dom";
import UserGameDetails from "@/components/UserGameDetails";
import levelConfig from "@/config/level-config";
import { uesStore } from "@/store";
import { useEffect } from "react";

export default function Home() {
  const user = useUserStore();
  const { maxLevel } = uesStore();

  const balance = useUserStore((s) => s.balance);
  useEffect(() => {
    const hasSpoken = localStorage.getItem("welcome_spoken");
    if (!hasSpoken) {
      setTimeout(() => {
        speakHindi("नमस्ते किसान"); // Hindi
        // OR
        // speakHindi("Hello Farmers"); // English in Indian accent (fallback)
      }, 800);
      localStorage.setItem("welcome_spoken", "1");
    }
  }, []);

  function speakHindi(text: string) {
    if (!("speechSynthesis" in window)) return;

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();

      // find Hindi / Indian voice
      const hindiVoice =
        voices.find(v => v.lang === "hi-IN") ||
        voices.find(v => v.lang.startsWith("hi")) ||
        voices.find(v => v.name.toLowerCase().includes("india")) ||
        voices[0]; // fallback

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = hindiVoice;
      utterance.lang = "hi-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    // 🟢 voices already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      // 🔁 wait until voices are loaded
      window.speechSynthesis.onvoiceschanged = speak;
    }
  }

  return (
    <div
      className="flex-1 px-5 pb-20 bg-center bg-cover"
      style={{
        backgroundImage: `url(${levelConfig.bg[user?.level?.level || 1]})`,
      }}
    >
      <header className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 px-3 py-2 border-2 rounded-full bg-black/20 border-white/10">
          <img
            src="/images/levels/Frog-1.png"
            alt="user-avatar"
            className="object-cover w-8 h-8 rounded-full"
          />
          <p className="text-sm font-medium uppercase">
            {user?.first_name} {user?.last_name}
          </p>
        </div>
      </header>
      <UserGameDetails className="mt-6" />
      <div className="flex mt-6 space-x-1.5 justify-center items-center select-none">
        <img
          src="/images/coins.png"
          alt="coins"
          className="object-contain w-20 h-20"
        />
        <span className="text-3xl font-bold text-gradient">
          {Math.floor(balance)?.toLocaleString()}
        </span>
      </div>
      <div className="">
        <Link
          to={"/leaderboard"}
          className="flex items-center justify-between gap-2"
        >
          <div className="flex items-center text-xs">
            <span>{user.level?.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs">Level</span>
            <span className="font-bold">
              {user.level?.level}/{maxLevel}
            </span>
          </div>
        </Link>
        <div className="bg-[#FFDAA3]/10 border overflow-hidden border-[#FFDAA3]/10 rounded-full mt-2 h-4 w-full">
          <div
            className="bg-[linear-gradient(180deg,#FBEDE0_0%,#F7B87D_21%,#F3A155_52%,#E6824B_84%,#D36224_100%)] h-full"
            style={{
              // width: `${(user.balance! / user.level!.to_balance) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <UserTap />
    </div>
  );
}
