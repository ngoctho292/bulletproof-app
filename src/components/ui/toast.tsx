"use client";

// Credits: https://github.com/2nthony/vercel-toast

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CheckmarkIcon } from "../icons/CheckmarkIcon";
import { ErrorIcon } from "../icons/ErrorIcon";
import { WarningIcon } from "../icons/WarningIcon";
import { InfoIcon } from "../icons/InfoIcon";

interface ToastPayload {
  title?: string;
  description?: string;
  duration?: number;
  type?: "foreground" | "background";
}

interface DispatchFunction {
  (payload: ToastPayload): void;
  success: (payload: ToastPayload) => void;
  warning: (payload: ToastPayload) => void;
  info: (payload: ToastPayload) => void;
  error: (payload: ToastPayload) => void;
}

const ToastContext = React.createContext<DispatchFunction | undefined>(undefined);

interface ToastContextImplValue {
  toastElementsMapRef: React.MutableRefObject<Map<string, HTMLElement | null>>;
  sortToasts: () => void;
}

const ToastContextImpl = React.createContext<ToastContextImplValue | undefined>(undefined);

const ANIMATION_OUT_DURATION = 350;

interface ToastsProps extends ToastPrimitive.ToastProviderProps {
  children?: React.ReactNode;
}

export const Toasts: React.FC<ToastsProps> = ({ children, ...props }) => {
  const [toasts, setToasts] = React.useState<Map<string, { open?: boolean; status?: "default" | "success" | "warning" | "info" | "error" } & ToastPayload>>(new Map());
  const toastElementsMapRef = React.useRef<Map<string, HTMLElement | null>>(new Map());
  const viewportRef = React.useRef<HTMLOListElement | null>(null);

  const sortToasts = React.useCallback(() => {
    const toastElements = Array.from(toastElementsMapRef.current).reverse();
    const heights: number[] = [];

    toastElements.forEach(([, toast], index) => {
      if (!toast) return;
      const height = toast.clientHeight;
      heights.push(height);
      const frontToastHeight = heights[0];
      toast.setAttribute("data-front", index === 0 ? "true" : "false");
      toast.setAttribute("data-hidden", index > 2 ? "true" : "false");
      toast.style.setProperty("--index", index.toString());
      toast.style.setProperty("--height", `${height}px`);
      toast.style.setProperty("--front-height", `${frontToastHeight}px`);
      const hoverOffsetY = heights
        .slice(0, index)
        .reduce((res, next) => res + next, 0);
      toast.style.setProperty("--hover-offset-y", `-${hoverOffsetY}px`);
    });
  }, []);

  const handleAddToast = React.useCallback((toast: ToastPayload & { status?: "default" | "success" | "warning" | "info" | "error" }) => {
    setToasts((currentToasts) => {
      const newMap = new Map(currentToasts);
      newMap.set(String(Date.now()), { ...toast, open: true, duration: 2000 });  
      return newMap;
    });
  }, []);

  const handleRemoveToast = React.useCallback((key: string) => {
    setToasts((currentToasts) => {
      const newMap = new Map(currentToasts);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const handleDispatchDefault = React.useCallback(
    (payload: ToastPayload) => handleAddToast({ ...payload, status: "default" }),
    [handleAddToast]
  );

  const handleDispatchSuccess = React.useCallback(
    (payload: ToastPayload) => handleAddToast({ ...payload, status: "success" }),
    [handleAddToast]
  );

  const handleDispatchWarning = React.useCallback(
    (payload: ToastPayload) => handleAddToast({ ...payload, status: "warning" }),
    [handleAddToast]
  );

  const handleDispatchInfo = React.useCallback(
    (payload: ToastPayload) => handleAddToast({ ...payload, status: "info" }),
    [handleAddToast]
  );

  const handleDispatchError = React.useCallback(
    (payload: ToastPayload) => handleAddToast({ ...payload, status: "error" }),
    [handleAddToast]
  );

  React.useEffect(() => {
    const viewport = viewportRef.current;

    if (viewport) {
      const handleFocus = () => {
        toastElementsMapRef.current.forEach((toast) => {
          if (toast) toast.setAttribute("data-hovering", "true");
        });
      };

      const handleBlur = (event: PointerEvent | FocusEvent) => {
        if (!viewport.contains(event.relatedTarget as Node) || viewport === event.relatedTarget) {
          toastElementsMapRef.current.forEach((toast) => {
            if (toast) toast.setAttribute("data-hovering", "false");
          });
        }
      };

      viewport.addEventListener("pointermove", handleFocus);
      viewport.addEventListener("pointerleave", handleBlur as EventListener);
      viewport.addEventListener("focusin", handleFocus);
      viewport.addEventListener("focusout", handleBlur as EventListener);
      return () => {
        viewport.removeEventListener("pointermove", handleFocus);
        viewport.removeEventListener("pointerleave", handleBlur as EventListener);
        viewport.removeEventListener("focusin", handleFocus);
        viewport.removeEventListener("focusout", handleBlur as EventListener);
      };
    }
  }, []);

  return (
    <ToastContext.Provider
      value={React.useMemo(
        () =>
          Object.assign(handleDispatchDefault, {
            success: handleDispatchSuccess,
            warning: handleDispatchWarning,
            info: handleDispatchInfo,
            error: handleDispatchError,
          }) as DispatchFunction,
        [handleDispatchDefault, handleDispatchSuccess, handleDispatchWarning, handleDispatchInfo, handleDispatchError]
      )}
    >
      <ToastContextImpl.Provider
        value={React.useMemo(
          () => ({
            toastElementsMapRef,
            sortToasts,
          }),
          [sortToasts]
        )}
      >
        <ToastPrimitive.Provider duration={2000} {...props}>
          {children}
          {Array.from(toasts).map(([key, toast]) => (
            <ToastItem
              key={key}
              id={key}
              toast={toast}
              onOpenChange={(open) => {
                if (!open) {
                  toastElementsMapRef.current.delete(key);
                  sortToasts();
                  setTimeout(() => {
                    handleRemoveToast(key);
                  }, ANIMATION_OUT_DURATION);
                }
              }}
            />
          ))}
          <ToastPrimitive.Viewport
            ref={viewportRef}
            className="ToastViewport"
          />
        </ToastPrimitive.Provider>
      </ToastContextImpl.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = (): DispatchFunction => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within Toasts");
  }
  return context;
};

export const useToastContext = (): ToastContextImplValue => {
  const context = React.useContext(ToastContextImpl);
  if (!context) {
    throw new Error("useToast must be used within Toasts");
  }
  return context;
};

interface ToastItemProps extends ToastPrimitive.ToastProps {
  id: string;
  toast: { status?: "default" | "success" | "warning" | "info" | "error"; description?: string; duration?: number; type?: "foreground" | "background"; title?: string };
  onOpenChange: (open: boolean) => void;
}

const ToastItem: React.FC<ToastItemProps> = (props) => {
  const { onOpenChange, toast, id, ...toastProps } = props;
  const ref = React.useRef<HTMLLIElement | null>(null);
  const context = useToastContext();
  const { sortToasts, toastElementsMapRef } = context;
  const toastElementsMap = toastElementsMapRef.current;

  React.useLayoutEffect(() => {
    if (ref.current) {
      toastElementsMap.set(id, ref.current);
      sortToasts();
    }
  }, [id, sortToasts, toastElementsMap]);

  return (
    <ToastPrimitive.Root
      {...toastProps}
      ref={ref}
      type={toast.type}
      duration={toast.duration}
      className="ToastRoot"
      onOpenChange={onOpenChange}
    >
      <div className="ToastInner" data-status={toast.status}>
        <ToastStatusIcon status={toast.status ?? "default"} />
        <ToastPrimitive.Title className="ToastTitle">
          <p>{toast.title}</p> 
        </ToastPrimitive.Title>
        <ToastPrimitive.Description className="ToastDescription">
          {toast.description}
        </ToastPrimitive.Description>
        <ToastPrimitive.Action
          className="ToastAction Button small green"
          altText="Goto schedule to undo"
        >
          Hủy
        </ToastPrimitive.Action>
        <ToastPrimitive.Close aria-label="Close" className="ToastClose">
          <Cross2Icon />
        </ToastPrimitive.Close>
      </div>
    </ToastPrimitive.Root>
  );
};

interface ToastStatusIconProps {
  status: "default" | "success" | "warning" | "info" | "error";
}

const ToastStatusIcon: React.FC<ToastStatusIconProps> = ({ status }) => {
  return status !== "default" ? (
    <div style={{ gridArea: "icon", alignSelf: "start" }}>
      {status === "success" && <CheckmarkIcon />}
      {status === "warning" && <WarningIcon />}
      {status === "info" && <InfoIcon />}
      {status === "error" && <ErrorIcon />}
    </div>
  ) : null;
};