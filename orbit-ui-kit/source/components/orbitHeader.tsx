import * as React from "react";
import { Icon, Button, useSidebar, useEventListener, ClassHelpers } from "@rocketmakers/armstrong";
import { OrbitBreadcrumb, IBreadcrumb } from "./orbitBreadcrumb";
import { OrbitIcons } from "../utils/orbitIcons";

interface IProps {
  className?: string;
  title: string;
  breadcrumb?: IBreadcrumb[];
  onBack?: () => void;
  icon?: string;
}

export const OrbitHeader: React.FC<IProps> = ({ children, className, breadcrumb, title, onBack, icon }) => {
  const { toggle } = useSidebar();
  const [top, setTop] = React.useState(true);

  const scrollPos = React.useRef(typeof window !== "undefined" && window.pageYOffset);

  const showBreadCrumb = React.useMemo(() => breadcrumb && breadcrumb.length > 1, [breadcrumb]);
  const handleScroll = React.useCallback(() => {
    const currentScrollPos = window.pageYOffset;

    scrollPos.current = currentScrollPos;
    setTop(currentScrollPos === 0);
  }, []);

  React.useEffect(() => {
    setTop(window.pageYOffset === 0);
  }, []);

  useEventListener("scroll", handleScroll);

  return (
    <div className={ClassHelpers.classNames("header", className)} data-top={top}>
      <Button onClick={toggle} className="menu-button">
        <Icon icon={Icon.Icomoon.menu7} />
      </Button>

      <div className="header-content">
        {showBreadCrumb && onBack && (
          <Button data-big={true} className="go-back-btn" onClick={onBack}>
            <Icon icon={OrbitIcons.left} />
          </Button>
        )}
        <div>
          {showBreadCrumb && <OrbitBreadcrumb breadcrumb={breadcrumb} />}
          <div className="title">
            {icon && <Icon icon={icon} />}
            {title}
          </div>
        </div>
        <div className="header-actions">{children}</div>
      </div>
    </div>
  );
};
