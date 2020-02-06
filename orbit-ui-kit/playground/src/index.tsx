import * as React from "react";
import * as ReactDOM from "react-dom";
import { Routes } from "./routes";

import "./theme/theme.scss";

async function render() {
  ReactDOM.render(<Routes />, document.getElementById("host"));
}

render();
