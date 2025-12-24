import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "./index.css";
import Providers from "./providers.tsx";

import { Toaster } from "sonner";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <Toaster
  position="top-center"
  theme="dark"
  richColors
  toastOptions={{
    style: {
      background: "#1b1b1b",
      border: "1px solid green",
      color: "#ffffff",
    },
  }}
/>
    <App />
  </Providers>
);
