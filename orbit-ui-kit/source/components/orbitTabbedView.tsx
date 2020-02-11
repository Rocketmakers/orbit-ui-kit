import * as React from "react";
import { IconName, IcomoonIcon, useMedia } from "@rocketmakers/armstrong";
import { NavLink, Switch, useRouteMatch, Redirect, Route } from "react-router-dom";
import { OrbitView } from "./orbitView";

interface ITab {
  component: React.FunctionComponent;
  name: string;
  icon?: IconName<"Icomoon">;
  to: string;
}

interface ITabbedViewProps {
  tabs: ITab[];
}

export const OrbitTabbedView: React.FunctionComponent<ITabbedViewProps> = ({ tabs }) => {
  const { url } = useRouteMatch();

  const defaultTab = React.useMemo(() => tabs && tabs.length && tabs[0].to, [tabs]);
  return (
    <OrbitView className="orbit-tabbed-view" mode="full-width">
      <div className="tabs">
        {tabs.map(tab => (
          <NavLink className="tab" activeClassName="active" to={`${url}/${tab.to}`}>
            {tab.icon && <IcomoonIcon iconName={tab.icon} />}
            <p>{tab.name}</p>
          </NavLink>
        ))}
      </div>
      <div className="tabs-inner">
        <Switch>
          {tabs.map(tab => (
            <Route path={`${url}/${tab.to}`} component={tab.component} />
          ))}
          <Redirect to={defaultTab ? `${url}/${defaultTab}` : url} />
        </Switch>
      </div>
    </OrbitView>
  );
};
