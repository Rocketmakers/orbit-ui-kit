import * as React from "react";
import { Icon, Tooltip, IconName, IcomoonIcon } from "@rocketmakers/armstrong";
import { NavLink } from "react-router-dom";

interface ISidebarLinkProps {
  sidebarOpen: boolean;
  icon: IconName<"Icomoon">;
  name: string;
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
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

const SidebarLinkInner: React.FC<ISidebarLinkProps> = ({ onClick, icon, sidebarOpen, name, to }) => (
  <NavLink to={to} className="sidebar-link" onClick={onClick} activeClassName="active">
    <IcomoonIcon iconName={icon} />
    {sidebarOpen && <p>{name}</p>}
  </NavLink>
);
