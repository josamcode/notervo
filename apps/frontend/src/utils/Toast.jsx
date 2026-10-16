import { toast } from "react-hot-toast";

const isMobileViewport = () =>
  typeof window !== "undefined" &&
  !window.matchMedia("(min-width: 768px) and (min-height: 500px)").matches;

const getToastOptions = () => {
  const isMobile = isMobileViewport();

  return {
    duration: 2000,
    position: isMobile ? "top-center" : "bottom-right",
    style: {
      fontSize: isMobile ? "13px" : "14px",
      padding: isMobile ? "8px 14px" : "10px 18px",
      maxWidth: isMobile ? "280px" : "380px",
      background: "#262624",
      color: "#FFFBF2",
      borderRadius: "999px",
    },
  };
};

export const showSuccess = (message) => {
  toast.success(message, getToastOptions());
};

export const showError = (message) => {
  toast.error(message, getToastOptions());
};
