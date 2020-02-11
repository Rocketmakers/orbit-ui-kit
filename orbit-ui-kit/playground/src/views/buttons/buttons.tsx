import * as React from "react";
import { OrbitView, OrbitButton, OrbitIcons, OrbitGroup } from "../../../../source";

export const ButtonsView: React.FC = () => {
  return (
    <OrbitView>
      <h1>Buttons</h1>
      <OrbitGroup>
        <OrbitButton leftIcon={OrbitIcons.tick} displayMode="positive">
          Positive button
        </OrbitButton>
        <OrbitButton leftIcon={OrbitIcons.cross} displayMode="negative">
          Negative button
        </OrbitButton>
      </OrbitGroup>
      <OrbitGroup label="Icon buttons (big)">
        <OrbitButton leftIcon={OrbitIcons.left} big={true} />
        <OrbitButton leftIcon={OrbitIcons.right} big={true} />
      </OrbitGroup>
      <OrbitGroup label="Icon buttons (accent)">
        <OrbitButton leftIcon={OrbitIcons.left} accent={true} />
        <OrbitButton leftIcon={OrbitIcons.right} accent={true} />
      </OrbitGroup>
      <OrbitGroup label="Icon buttons (inverted)">
        <OrbitButton leftIcon={OrbitIcons.left} invert={true} />
        <OrbitButton leftIcon={OrbitIcons.right} invert={true} />
      </OrbitGroup>
    </OrbitView>
  );
};
