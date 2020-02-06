import * as React from "react";
import { Icon, ToastProvider, DialogProvider } from "@rocketmakers/armstrong";
import { useHistory, useLocation } from "react-router-dom";
import { OrbitSidebar } from "../../../source/components/orbitSidebar";
import { OrbitColorSetter } from "../../../source/components/orbitColorSetter";

export const Shell: React.FC = ({ children }) => {
  const { push } = useHistory();
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <ToastProvider hostElement="#host">
      <DialogProvider>
        <OrbitSidebar
          name="Components"
          links={[
            {
              icon: Icon.Icomoon.bubbleSmiley,
              name: "Welcome",
              isActive: pathname === "/",
              onClick: () => push("/")
            },
            {
              icon: Icon.Icomoon.minus,
              name: "Header",
              isActive: pathname === "/header",
              onClick: () => push("/header")
            },
            {
              icon: Icon.Icomoon.eyeBlocked2,
              name: "Hidden field",
              isActive: pathname === "/hidden-field",
              onClick: () => push("/hidden-field")
            },
            {
              icon: Icon.Icomoon.grid6,
              name: "Group",
              isActive: pathname === "/group",
              onClick: () => push("/group")
            },
            {
              icon: Icon.Icomoon.pencil,
              name: "Editable",
              isActive: pathname === "/editable",
              onClick: () => push("/editable")
            },
            {
              icon: Icon.Icomoon.popout,
              name: "Dialogs",
              isActive: pathname === "/dialogs",
              onClick: () => push("/dialogs")
            },
            {
              icon: Icon.Icomoon.fish,
              name: "Hooks",
              isActive: pathname === "/hooks",
              onClick: () => push("/hooks")
            },
            {
              icon: Icon.Icomoon.checkboxUnchecked2,
              name: "Views",
              isActive: pathname === "/views",
              onClick: () => push("/views")
            },
            {
              icon: Icon.Icomoon.grid2,
              name: "Icon set",
              isActive: pathname === "/icon-set",
              onClick: () => push("/icon-set")
            }
          ]}
        >
          {children}
        </OrbitSidebar>
        <OrbitColorSetter color="#0D3B66" />
      </DialogProvider>
    </ToastProvider>
  );
};
