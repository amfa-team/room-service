import React from "react";

export function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="-1 -1 104 104"
    >
      <path d="M30.05 61.74h23.47" stroke="#fff" strokeWidth="4" />
      <path d="M46.48 38.26h23.47" stroke="#fff" strokeWidth="4" />
      <path
        fillOpacity="0"
        d="M62.91 53.47c-4.56 0-8.26 3.7-8.26 8.27 0 4.56 3.7 8.26 8.26 8.26 4.57 0 8.27-3.7 8.27-8.26 0-4.57-3.7-8.27-8.27-8.27z"
        stroke="#fff"
        strokeWidth="4"
      />
      <path
        fillOpacity="0"
        d="M37.09 46.53c-4.57 0-8.27-3.7-8.27-8.27 0-4.56 3.7-8.26 8.27-8.26 4.56 0 8.26 3.7 8.26 8.26 0 4.57-3.7 8.27-8.26 8.27z"
        stroke="#fff"
        strokeWidth="4"
      />
    </svg>
  );
}

SettingsIcon.defaultProps = {
  enabled: false,
};
