import * as React from "react";
import { IconName, IcomoonIcon, useMedia } from "@rocketmakers/armstrong";
import { NavLink, Switch, useRouteMatch, Redirect, Route } from "react-router-dom";
import { OrbitView } from "./orbitView";

interface ITab {
  component: React.FunctionComponent;
  name: string;
  icon?: IconName<"Icomoon">;
  to?: string;
  onClick?: (tabIndex: number) => void;
}

interface ITabbedViewProps {
  activeTab?: number;
  tabs: ITab[];
}

export const OrbitTabbedView: React.FunctionComponent<ITabbedViewProps> = ({ tabs, activeTab }) => {
  const { url } = useRouteMatch();

  const defaultTab = React.useMemo(() => tabs && tabs.length && tabs[0].to, [tabs]);
  const ActiveTabComponent = React.useMemo(() => activeTab !== undefined && tabs[activeTab].component, [activeTab, tabs]);
  return (
    <OrbitView className="orbit-tabbed-view" mode="full-width">
      <div className="tabs">
        {tabs.map((tab, i) => (
          <React.Fragment key={i}>
            {activeTab !== undefined ? (
              <button className={`tab ${activeTab === i ? "active" : ""}`} onClick={() => tab.onClick(i)}>
                <TabInner {...tab} />
              </button>
            ) : (
              <NavLink className="tab" activeClassName="active" to={`${url}/${tab.to}`}>
                <TabInner {...tab} />
              </NavLink>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="tabs-inner">
        {activeTab !== undefined ? (
          <ActiveTabComponent />
        ) : (
          <Switch>
            {tabs.map(tab => (
              <Route path={`${url}/${tab.to}`} component={tab.component} />
            ))}
            <Redirect to={defaultTab ? `${url}/${defaultTab}` : url} />
          </Switch>
        )}
      </div>
    </OrbitView>
  );
};

const TabInner: React.FC<ITab> = ({ icon, name }) => (
  <>
    {icon && <IcomoonIcon iconName={icon} />}
    <p>{name}</p>
  </>
);
