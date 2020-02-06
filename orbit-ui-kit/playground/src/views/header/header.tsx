import * as React from "react";
import { OrbitHeader } from "../../../../source/components/orbitHeader";
import { useToast, Button, Icon, TextInput } from "@rocketmakers/armstrong";
import "./header.scss";
import { OrbitView, OrbitGroup } from "../../../../source";

export const HeaderView: React.FC = () => {
  const { dispatch } = useToast();
  return (
    <OrbitView>
      <h1>Header</h1>
      <h3>Header simple</h3>
      <div className="component-container">
        <OrbitHeader title="Route page" />
      </div>
      <div className="component-container">
        <OrbitHeader title="Users" icon={Icon.Icomoon.users}>
          <TextInput rightIcon={Icon.Icomoon.search} placeholder="Pls writ som txt" />
          <Button onClick={() => console.log("wow")} data-big={true}>
            <Icon icon={Icon.Icomoon.plus3} />
          </Button>
        </OrbitHeader>
      </div>
      <h3>Header with buttons</h3>
      <div className="component-container">
        <OrbitHeader
          onBack={() => console.log("wow")}
          breadcrumb={[{ label: "Route page" }, { label: "Not route page", onRoute: () => console.log("wow") }]}
          title="Not route page"
        >
          <Button onClick={() => console.log("wow")} data-has-text={false}>
            <Icon icon={Icon.Icomoon.pencil} />
          </Button>
          <Button onClick={() => console.log("wow")} data-danger={true} data-has-text={false}>
            <Icon icon={Icon.Icomoon.bin} />
          </Button>
          <Button onClick={() => console.log("wow")} data-big={true}>
            <Icon icon={Icon.Icomoon.plus3} />
          </Button>
        </OrbitHeader>
      </div>
      <div className="component-container">
        <OrbitHeader
          onBack={() => console.log("wow")}
          breadcrumb={[{ label: "Users" }, { label: "User", onRoute: () => console.log("wow") }]}
          title="User"
          icon={Icon.Icomoon.user}
        >
          <Button onClick={() => console.log("wow")} data-big={true}>
            <Icon icon={Icon.Icomoon.plus3} />
          </Button>
        </OrbitHeader>
      </div>
    </OrbitView>
  );
};
