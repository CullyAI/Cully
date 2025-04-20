import React, { createContext, useContext, useRef, useEffect } from "react";
import { Animated } from "react-native";

const NavContext = createContext({
  showNav: () => {},
  hideNav: () => {},
  animatedValue: new Animated.Value(0),
});

export const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const showNav = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideNav = () => {
    Animated.timing(animatedValue, {
      toValue: 100, // Adjust based on nav height
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <NavContext.Provider value={{ showNav, hideNav, animatedValue }}>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => useContext(NavContext);
