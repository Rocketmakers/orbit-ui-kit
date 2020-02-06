import * as React from "react";
import { Icon, Tooltip } from "@rocketmakers/armstrong";

interface ISidebarLinkProps {
  sidebarOpen: boolean;
  icon: string;
  name: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const OrbitSidebarLink: React.FunctionComponent<ISidebarLinkProps> = props => {
  return (
    <>
      {props.sidebarOpen && <SidebarLinkInner {...props} />}
      {!props.sidebarOpen && (
        <Tooltip tooltip={props.name} customPosition={["right", "hidden"]}>
          <SidebarLinkInner {...props} />
        </Tooltip>
      )}
    </>
  );
};

const SidebarLinkInner: React.FC<ISidebarLinkProps> = ({ onClick, icon, isActive, sidebarOpen, name }) => (
  <div className="sidebar-link" onClick={onClick} data-is-active={isActive}>
    <Icon icon={icon} />
    {sidebarOpen && <p>{name}</p>}
  </div>
);
