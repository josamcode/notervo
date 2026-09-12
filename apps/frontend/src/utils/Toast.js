import { toast } from "react-hot-toast";

const isMobileViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

const getToastOptions = () => {
  const isMobile = isMobileViewport();

  return {
    duration: 2000,
    position: isMobile ? "top-center" : "bottom-right",
    style: {
      fontSize: isMobile ? "13px" : "14px",
      padding: isMobile ? "8px 10px" : "10px 14px",
      maxWidth: isMobile ? "260px" : "360px",
    },
  };
};

export const showSuccess = (message) => {
  toast.success(message, getToastOptions());
};

export const showError = (message) => {
  toast.error(message, getToastOptions());
};
