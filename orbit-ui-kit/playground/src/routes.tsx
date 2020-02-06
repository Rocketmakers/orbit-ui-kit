import * as React from "react";
import { Route, Switch, Redirect, Router } from "react-router-dom";
import { Shell } from "./views/shell";

import { createBrowserHistory } from "history";
import { WelcomeView } from "./views/welcome/welcome";
import { HeaderView } from "./views/header/header";
import { HiddenFieldView } from "./views/hiddenField/hiddenField";
import { GroupView } from "./views/group/group";
import { HooksView } from "./views/hooks/hooks";
import { DialogsView } from "./views/dialogs/dialogs";
import { EditableView } from "./views/editable/editable";
import { ViewView } from "./views/view/view";
import { IconSetView } from "./views/iconSet/iconSet";
export const history = createBrowserHistory();

export const Routes: React.FunctionComponent = () => (
  <Router history={history}>
    <Shell>
      <Switch>
        <Route exact path={"/"} component={WelcomeView} />
        <Route exact path={"/header"} component={HeaderView} />
        <Route exact path={"/hidden-field"} component={HiddenFieldView} />
        <Route exact path={"/group"} component={GroupView} />
        <Route exact path={"/editable"} component={EditableView} />
        <Route exact path={"/dialogs"} component={DialogsView} />
        <Route exact path={"/hooks"} component={HooksView} />
        <Route exact path={"/views"} component={ViewView} />
        <Route exact path={"/icon-set"} component={IconSetView} />
        <Redirect path="*" to={`/`} />
      </Switch>
    </Shell>
  </Router>
);