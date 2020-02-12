import * as React from "react";
import { ToastProvider, DialogProvider } from "@rocketmakers/armstrong";
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
              icon: "bubbleSmiley",
              name: "Welcome",
              to: "/welcome"
            },
            {
              icon: "minus",
              name: "Header",
              to: "/header"
            },
            {
              icon: "eyeBlocked2",
              name: "Hidden field",
              to: "/hidden-field"
            },
            {
              icon: "grid6",
              name: "Group",
              to: "/group"
            },
            {
              icon: "pencil",
              name: "Editable",
              to: "/editable"
            },
            {
              icon: "popout",
              name: "Dialogs",
              to: "/dialogs"
            },
            {
              icon: "fish",
              name: "Hooks",
              to: "/hooks"
            },
            {
              icon: "checkboxUnchecked2",
              name: "Views",
              to: "/views"
            },
            {
              icon: "tab",
              name: "Tabs",
              to: "/tabs"
            },
            {
              icon: "grid2",
              name: "Icon set",
              to: "/icon-set"
            },
            {
              icon: "mouse",
              name: "Buttons",
              to: "/buttons"
            },
            {
              icon: "spinner2",
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
