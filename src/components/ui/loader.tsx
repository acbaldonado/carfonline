import React from "react";

interface LoaderProps {
  size?: number;      // width & height of loader
  overlay?: boolean;  // show overlay or not
}

const Loader: React.FC<LoaderProps> = ({ size = 72, overlay = true }) => {
  const boxes = Array.from({ length: 9 });

  const loaderDiv = (
    <div
      className="banter-loader"
      style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
    >
      {boxes.map((_, i) => (
        <div key={i} className="banter-loader__box"></div>
      ))}
    </div>
  );

  return overlay ? (
    <div className="banter-loader-overlay">{loaderDiv}</div>
  ) : (
    loaderDiv
  );
};

export default Loader;