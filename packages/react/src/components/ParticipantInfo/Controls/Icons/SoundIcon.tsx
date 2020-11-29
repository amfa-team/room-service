import React, { useCallback, useEffect, useState } from "react";

interface SoundIconProps {
  enabled: boolean;
}

export function SoundIcon(props: SoundIconProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(props.enabled);
  }, [props.enabled]);

  const toggle = useCallback(() => {
    setEnabled((p) => !p);
  }, []);

  if (enabled) {
    return (
      <svg
        onClick={toggle}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="-1 -1 104 104"
      >
        <defs>
          <path
            id="g"
            d="M32.64 41.43L46.93 30v40L32.64 58.57H21.22V41.43h11.42z"
          />
          <path
            id="h"
            d="M70.5 30c2.62 2.63 4.71 5.74 6.13 9.18A28.299 28.299 0 0170.5 70"
          />
          <path
            id="i"
            d="M59.52 39.78a15.37 15.37 0 013.35 5 15.57 15.57 0 011.17 5.91c0 2.02-.4 4.03-1.17 5.9a15.52 15.52 0 01-3.35 5.01"
          />
        </defs>
        <g>
          <use fillOpacity="0" stroke="#fff" strokeWidth="4" xlinkHref="#g" />
        </g>
        <g>
          <use fillOpacity="0" stroke="#fff" strokeWidth="4" xlinkHref="#h" />
        </g>
        <g>
          <use fillOpacity="0" stroke="#fff" strokeWidth="4" xlinkHref="#i" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      onClick={toggle}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="-1 -1 104 104"
    >
      <defs>
        <path
          id="g"
          d="M32.64 41.43L46.93 30v40L32.64 58.57H21.22V41.43h11.42z"
        />
        <path
          id="h"
          d="M70.5 30c2.62 2.63 4.71 5.74 6.13 9.18A28.299 28.299 0 0170.5 70"
        />
        <path
          id="i"
          d="M59.52 39.78a15.37 15.37 0 013.35 5 15.57 15.57 0 011.17 5.91c0 2.02-.4 4.03-1.17 5.9a15.52 15.52 0 01-3.35 5.01"
        />
        <path id="j" d="M78.78 39.39L57.57 60.61" />
        <path id="k" d="M57.57 39.39l21.21 21.22" />
      </defs>
      <g>
        <use fillOpacity="0" stroke="#fff" strokeWidth="4" xlinkHref="#g" />
      </g>
      <g>
        <use fillOpacity="0" stroke="#fff" strokeWidth="4" xlinkHref="#j" />
      </g>
      <g>
        <use fillOpacity="0" stroke="#fff" strokeWidth="4" xlinkHref="#k" />
      </g>
    </svg>
  );
}

SoundIcon.defaultProps = {
  enabled: false,
};
