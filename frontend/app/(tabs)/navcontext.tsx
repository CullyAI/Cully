import React, { createContext, useContext, useState } from "react";


type NavContextType = {
  hideNav: () => void;
  showNav: () => void;
  navHidden: boolean;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [navHidden, setNavHidden] = useState(false);

  const hideNav = () => setNavHidden(true);
  const showNav = () => setNavHidden(false);

  return (
    <NavContext.Provider value={{ hideNav, showNav, navHidden }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) throw new Error("useNav must be used within a NavProvider");
  return context;
};
