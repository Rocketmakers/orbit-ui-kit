import * as React from "react";
import { OrbitView } from "../../../../source";

export const WelcomeView: React.FC = () => {
  return (
    <OrbitView>
      <h1>Welcome!</h1>
      <p>These are some components</p>
      <a href="https://www.figma.com/file/lb4u8j7pppdFSySAqngcVg/Orbit-Design-Guide" target="_blank">
        Figma style guide
      </a>
    </OrbitView>
  );
};
