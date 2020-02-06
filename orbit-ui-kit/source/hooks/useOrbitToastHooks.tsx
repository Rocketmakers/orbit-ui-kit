import * as React from "react";
import { useToast, IToastNotification } from "@rocketmakers/armstrong";

export const useOrbitToast = () => {
  const { dispatch } = useToast();
  const defaultToastSettings = React.useMemo<Partial<IToastNotification>>(
    () => ({
      autodismiss: 4000,
      className: "auth-toast"
    }),
    []
  );
  const sendOK = React.useCallback(
    (message: string, config: Partial<IToastNotification> = {}) => {
      dispatch({ ...defaultToastSettings, message, type: "success", ...config });
    },
    [dispatch, defaultToastSettings]
  );
  const sendInfo = React.useCallback(
    (message: string, config: Partial<IToastNotification> = {}) => {
      dispatch({ ...defaultToastSettings, message, type: "info", ...config });
    },
    [dispatch, defaultToastSettings]
  );
  const sendError = React.useCallback(
    (message: string, config: Partial<IToastNotification> = {}) => {
      dispatch({ ...defaultToastSettings, message, type: "error", ...config });
    },
    [dispatch, defaultToastSettings]
  );

  const sendErrors = React.useCallback(
    (messages: string[], config: Partial<IToastNotification> = {}) => {
      messages.forEach(message => {
        dispatch({ ...defaultToastSettings, message, type: "error", ...config });
      });
    },
    [dispatch, defaultToastSettings]
  );
  const sendWarning = React.useCallback(
    (message: string, config: Partial<IToastNotification> = {}) => {
      dispatch({ ...defaultToastSettings, message, type: "warning", ...config });
    },
    [dispatch, defaultToastSettings]
  );
  return { sendOK, sendWarning, sendInfo, sendError, sendErrors };
};
