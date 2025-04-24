import React, { createContext, useContext, useRef } from "react";
import { Animated } from "react-native";

const NavContext = createContext({
  showNav: () => {},
  hideNav: () => {},
  showTopBar: () => {},
  hideTopBar: () => {},
  bottomNavValue: new Animated.Value(0),
  topBarValue: new Animated.Value(0),
});

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const bottomNavValue = useRef(new Animated.Value(0)).current;
  const topBarValue = useRef(new Animated.Value(0)).current;

  const showNav = () => {
    Animated.timing(bottomNavValue, {
      toValue: 0,
      duration: 900,
      useNativeDriver: true,
    }).start();
  };

  const hideNav = () => {
    Animated.timing(bottomNavValue, {
      toValue: 100, // adjust based on tab height
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const showTopBar = () => {
    Animated.timing(topBarValue, {
      toValue: 0,
      duration: 900,
      useNativeDriver: true,
    }).start();
  };

  const hideTopBar = () => {
    Animated.timing(topBarValue, {
      toValue: -100, // move up off-screen
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <NavContext.Provider
      value={{
        showNav,
        hideNav,
        showTopBar,
        hideTopBar,
        bottomNavValue,
        topBarValue,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => useContext(NavContext);
