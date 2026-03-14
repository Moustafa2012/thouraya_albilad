import { useState, useEffect } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

let toastFn: (props: ToastProps) => void = () => {};

export const toast = (props: ToastProps) => {
  toastFn(props);
};

export const useToast = () => {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);

  useEffect(() => {
    toastFn = (props: ToastProps) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...props, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, props.duration || 3000);
    };
  }, []);

  return { toasts };
};
