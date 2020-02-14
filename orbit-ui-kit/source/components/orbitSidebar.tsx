import * as React from "react";
import { Sidebar, Icons, IconName } from "@rocketmakers/armstrong";
import { OrbitSidebarLink } from "./orbitSidebarLink";
import { OrbitIcons } from "../utils/orbitIcons";

export interface IOrbitSideBarProps {
  name: string;
  links: ISidebarLinkType[];
}

interface ISidebarLink {
  icon: IconName<"Icomoon">;
  name: string;
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
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

          {links.map((link, i) => {
            if (sidebarLinkIsElement(link)) {
              return <React.Fragment key={i}>{link}</React.Fragment>;
            }
            return <OrbitSidebarLink key={i} sidebarOpen={isOpen} {...link} />;
          })}
        </>
      )}
    >
      {children}
    </Sidebar>
  );
};
