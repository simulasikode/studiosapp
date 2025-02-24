// utils/toast.ts
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastFunctions = {
  success: toast.success,
  error: toast.error,
  info: toast.info,
  warning: toast.warning,
  dark: toast.dark,
} as const;

type ToastFunctionKey = keyof typeof toastFunctions;
type ToastFunction = (typeof toastFunctions)[ToastFunctionKey];

export const showToast = (
  title: string,
  description: string,
  status: ToastFunctionKey,
): void => {
  const toastFunction: ToastFunction = toastFunctions[status];

  toastFunction(`${title}: ${description}`, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const useToast = () => {
  return { showToast };
};
