import * as React from "react";
import { Location } from "history";
import { Prompt, useHistory } from "react-router-dom";
import { IDataBinder, useDialogProvider, useDidUpdateEffect } from "@rocketmakers/armstrong";
import { OrbitConfirmationDialog } from "../components/orbitConfirmationDialog";

export function useOrbitDirtyDialog<TBound>(
  dataBinder?: IDataBinder<TBound>,
  content?: JSX.Element | string | number,
  resetDependencies?: React.DependencyList
) {
  const [isDirty, setIsDirty] = React.useState(false);
  const open = useDialogProvider(OrbitConfirmationDialog, { allowCloseOnBackgroundClick: true });
  const history = useHistory();
  useDidUpdateEffect(() => {
    setIsDirty(true);
  }, [JSON.stringify(dataBinder.toJson())]);
  React.useEffect(() => {
    setIsDirty(false);
  }, [dataBinder, ...(resetDependencies || [])]);
  const openDialog = React.useCallback<(location: Location<any>) => Promise<void>>(
    async location => {
      const ok = await open(content);
      if (ok) {
        setIsDirty(false);
        history.push(location.pathname);
      }
    },
    [setIsDirty, history, open, content]
  );
  const prompt = React.useCallback<(location: Location<any>) => string | boolean>(
    location => {
      if (isDirty) {
        openDialog(location);
        return false;
      }
      return true;
    },
    [isDirty, openDialog]
  );
  const resetDirtyPrompt = React.useCallback(() => {
    setIsDirty(false);
  }, [setIsDirty]);
  const DirtyPrompt = React.useCallback<React.FC>(() => <Prompt when={isDirty} message={prompt} />, [isDirty, prompt]);
  return { DirtyPrompt, resetDirtyPrompt };
}
