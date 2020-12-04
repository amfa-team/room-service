import React from "react";

export function BanIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="-1 -1 104 104"
    >
      <path d="M50 25.33v30" fillOpacity="0" stroke="#fff" strokeWidth="6" />
      <path d="M50 70.33v6" fillOpacity="0" stroke="#fff" strokeWidth="6" />
    </svg>
  );
}

BanIcon.defaultProps = {
  enabled: false,
};
