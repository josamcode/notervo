import { toast } from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 2000,
    position: "bottom-right",
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 2000,
    position: "bottom-right",
  });
};
