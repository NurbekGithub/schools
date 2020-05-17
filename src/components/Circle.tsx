import React from "react";

export default function Circle(props) {
  const { children, styles, handleClick } = props;
  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        width: '5vw',
        height: '5vw',
        borderRadius: '50%',
        border: '.3vw solid red',
        ...styles,
      }}
    >
      {children}
    </div>
  );
}
