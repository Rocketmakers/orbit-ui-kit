import * as React from "react";
import { Icon, ToastProvider, DialogProvider } from "@rocketmakers/armstrong";
import { useHistory, useLocation } from "react-router-dom";
import { OrbitSidebar } from "../../../source/components/orbitSidebar";
import { OrbitColorSetter } from "../../../source/components/orbitColorSetter";

export const Shell: React.FC = ({ children }) => {
  return (
    <ToastProvider hostElement="#host">
      <DialogProvider>
        <OrbitSidebar
          name="Components"
          links={[
            {
              icon: Icon.Icomoon.bubbleSmiley,
              name: "Welcome",
              to: "/welcome"
            },
            {
              icon: Icon.Icomoon.minus,
              name: "Header",
              to: "/header"
            },
            {
              icon: Icon.Icomoon.eyeBlocked2,
              name: "Hidden field",
              to: "/hidden-field"
            },
            {
              icon: Icon.Icomoon.grid6,
              name: "Group",
              to: "/group"
            },
            {
              icon: Icon.Icomoon.pencil,
              name: "Editable",
              to: "/editable"
            },
            {
              icon: Icon.Icomoon.popout,
              name: "Dialogs",
              to: "/dialogs"
            },
            {
              icon: Icon.Icomoon.fish,
              name: "Hooks",
              to: "/hooks"
            },
            {
              icon: Icon.Icomoon.checkboxUnchecked2,
              name: "Views",
              to: "/views"
            },
            {
              icon: Icon.Icomoon.tab,
              name: "Tabs",
              to: "/tabs"
            },
            {
              icon: Icon.Icomoon.grid2,
              name: "Icon set",
              to: "/icon-set"
            },
            {
              icon: Icon.Icomoon.mouse,
              name: "Buttons",
              to: "/buttons"
            },
            {
              icon: Icon.Icomoon.spinner2,
              name: "Spinner",
              to: "/spinner"
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
