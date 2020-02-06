import * as React from "react";
import { OrbitView, OrbitGroup, OrbitIcons } from "../../../../source";
import { Icon } from "@rocketmakers/armstrong";
import "./iconSet.scss";
export const IconSetView: React.FC = () => {
  return (
    <OrbitView mode="form">
      <h1>Icon set</h1>
      <OrbitGroup label="OrbitIcons" className="orbit-icon-set">
        <div>
          <Icon icon={OrbitIcons.add} />
          <span>add</span>
        </div>
        <div>
          <Icon icon={OrbitIcons.delete} />
          <span>delete</span>
        </div>
        <div>
          <Icon icon={OrbitIcons.edit} />
          <span>edit</span>
        </div>
        <div>
          <Icon icon={OrbitIcons.cancel} />
          <span>cancel</span>
        </div>
        <div>
          <Icon icon={OrbitIcons.cross} />
          <span>cross</span>
        </div>
        <div>
          <Icon icon={OrbitIcons.up} />
          <span>up</span>
        </div>
        <div>
          <Icon icon={OrbitIcons.down} />
          <span>down</span>
        </div>
        <div>
          <Icon icon={OrbitIcons.left} />
          <span>left</span>
        </div>
        <div>
          <Icon icon={OrbitIcons.right} />
          <span>right</span>
        </div>
      </OrbitGroup>
    </OrbitView>
  );
};
