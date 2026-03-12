import { useState, useEffect } from "react";

const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileBreakpoint = 768;
    const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);

    const onChange = () => {
      setIsMobile(mql.matches);
    };

    setIsMobile(mql.matches);

    mql.addEventListener("change", onChange);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return { isMobile, isDesktop: !isMobile };
};

export default useDeviceType;
