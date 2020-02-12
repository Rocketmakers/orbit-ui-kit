import * as React from "react";
import { OrbitTabbedView, OrbitView, OrbitGroup } from "../../../../source";
import { useLocation } from "react-router-dom";

export const TabsView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const { pathname } = useLocation();
  return (
    <OrbitView>
      <h1>Tabbed view</h1>
      <OrbitGroup label="Routed tabs">
        <div>Pathname {pathname}</div>
        <OrbitTabbedView
          tabs={[
            { component: () => <OrbitView>this is the first tab</OrbitView>, name: "Tab 1", to: "tab1", icon: "weatherRain" },
            { component: () => <OrbitView>second tab</OrbitView>, name: "Tab 2", to: "tab2", icon: "wrench3" },
            { component: () => <OrbitView>wow... its the third tab</OrbitView>, name: "Tab 3", to: "/tab3", icon: "wink" }
          ]}
        />
      </OrbitGroup>
      <OrbitGroup label="State tabs">
        <div>State - activeTab {activeTab}</div>
        <OrbitTabbedView
          activeTab={activeTab}
          tabs={[
            { component: () => <OrbitView>this is the first tab</OrbitView>, name: "Tab 1", onClick: setActiveTab, icon: "weatherRain" },
            { component: () => <OrbitView>second tab</OrbitView>, name: "Tab 2", onClick: setActiveTab, icon: "wrench3" },
            { component: () => <OrbitView>wow... its the third tab</OrbitView>, name: "Tab 3", onClick: setActiveTab, icon: "wink" }
          ]}
        />
      </OrbitGroup>
    </OrbitView>
  );
};
