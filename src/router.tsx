import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/partials/Layout";
import Home from "./pages/Home";
import Boost from "./pages/Boost";
import Leaderboard from "./pages/Leaderboard";
import Earn from "./pages/Earn";
import Friends from "./pages/Friends";
import Missions from "./pages/Missions";
import Deposit from "./pages/Deposit";
import Swap from "./pages/Swap";
import Withdraw from "./pages/Withdraw";
import Assets from "./pages/Assets";
import History from "./pages/History";
import Upgrade from "./pages/Upgrade";
import LevelUsers from "./pages/LevelUsers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "boost",
        element: <Boost />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "friends",
        element: <Friends />,
      },
      {
        path: "earn",
        element: <Earn />,
      },
      {
        path: "missions",
        element: <Missions />,
      },
       {
        path: "deposit",
        element: <Deposit />,
      },
      {
        path: "swap",
        element: <Swap />,
      },
       {
        path: "withdraw",
        element: <Withdraw />,
      },
      {
        path: "assets",
        element: <Assets />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "upgrade",
        element: <Upgrade />,
      },
      {
        path: "/team/level/:level",
        element: <LevelUsers />,
      },
    ],
  },
]);

export default router;
