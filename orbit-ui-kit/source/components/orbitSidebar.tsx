import * as React from "react";
import { Sidebar, Icons } from "@rocketmakers/armstrong";
import { OrbitSidebarLink } from "./orbitSidebarLink";
import { OrbitIcons } from "../utils/orbitIcons";

export interface IOrbitSideBarProps {
  name: string;
  links: ISidebarLinkType[];
}

interface ISidebarLink {
  icon: string;
  name: string;
  onClick?: () => void;
  isActive?: boolean;
}

type ISidebarLinkType = ISidebarLink | JSX.Element;

function sidebarLinkIsElement(input: ISidebarLinkType): input is JSX.Element {
  return !!React.isValidElement(input);
}

export const OrbitSidebar: React.FC<IOrbitSideBarProps> = ({ children, name, links }) => {
  return (
    <Sidebar
      openButtonIcon={OrbitIcons.right}
      closeButtonIcon={OrbitIcons.left}
      collaspedWidth={90}
      content={({ isOpen }) => (
        <>
          {isOpen && (
            <div className="orbit-sidebar-logo">
              <h1>Orbit</h1>
              <p>{name}</p>
            </div>
          )}

          {links.map(link => {
            if (sidebarLinkIsElement(link)) {
              return link;
            }
            return <OrbitSidebarLink sidebarOpen={isOpen} {...link} />;
          })}
        </>
      )}
    >
      {children}
    </Sidebar>
  );
};
