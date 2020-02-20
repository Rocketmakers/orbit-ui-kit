import * as React from "react";
import { OrbitButton } from "./orbitButton";
import { Icons } from "@rocketmakers/armstrong";

interface IErrorCatcherProps {
  /**
   * Custom override for behaviour when "Reload App" is clicked.
   * @default - Does a hard redirect back to "/" with full page reload.
   */
  onReloadApp?: () => void;
  /**
   * Custom override for the error message to show when specific error info is available (should never be seen, just a backstop.)
   * @default "Unknown Error"
   */
  defaultErrorMessage?: string;
  /**
   * Custom override for the heading of the error modal.
   * @default "<h1>Houston, we have a problem...</h1>"
   */
  customHeading?: React.ReactText | JSX.Element;
  /**
   * Custom override for the body of the error modal (above the error display).
   * @default "<p>If this keeps happening, please contact the support team and include the below error details in your communication:</p>"
   */
  customBody?: React.ReactText | JSX.Element;
}

interface IErrorCatcherState {
  error?: any;
}

export class ErrorCatcher extends React.Component<IErrorCatcherProps, IErrorCatcherState> {
  static getDerivedStateFromError = (e: any) => ({ error: e });

  constructor(props: IErrorCatcherProps) {
    super(props);
    this.state = {};
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("ERROR", error, info);
  }

  private reloadApp = () => {
    const { onReloadApp } = this.props;
    if (onReloadApp) {
      onReloadApp();
    } else {
      window.location.href = "/";
    }
  };

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return <FullError error={error} onReloadApp={this.reloadApp} />;
    }

    return <>{children}</>;
  }
}

interface IProps extends IErrorCatcherProps {
  error: any;
}

const FullError: React.FC<IProps> = ({ error, onReloadApp, customBody, customHeading, defaultErrorMessage }) => {
  const errorText = React.useMemo(() => {
    if (error) {
      if (error.stack) {
        return error.stack;
      }
      if (error.message) {
        return error.message;
      }
      if (error.name) {
        return error.name;
      }
      if (typeof error === "string") {
        return error;
      }
    }
    return defaultErrorMessage || "Unknown error";
  }, [error]);

  const fullText = React.useMemo(() => {
    return `ROUTE:\n${document.location.href}\n\nERROR:\n${errorText}`;
  }, [document.location.href, errorText]);

  return (
    <div className="full-error">
      <div className="full-error-inner">
        {customHeading || <h1>Houston, we have a problem...</h1>}
        {customBody || (
          <p>If this keeps happening, please contact the support team and include the below error details in your communication:</p>
        )}
        <pre>{fullText}</pre>
        <div className="full-error-buttons">
          <OrbitButton displayMode="positive" onClick={onReloadApp} leftIcon={Icons.Icomoon.loop3}>
            Reload App
          </OrbitButton>
        </div>
      </div>
    </div>
  );
};
