import * as React from "react";

interface IProps {
  color: string;
}

export const OrbitColorSetter: React.FC<IProps> = ({ color }) => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `body { --orbit-color: ${color}}`
      }}
    />
  );
};
