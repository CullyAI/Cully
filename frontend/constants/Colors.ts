
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FF0000";

// selected page icon in nav bar v
const tintColorDark = "#1E477D";

const navBarColor = "#FFFBF4";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    //tint: tintColorLight,
    //navBar: navBarColor,
    icon: "#687076",
    tabIconDefault: "#D2B378", // <-- Inactive
    tabIconSelected: tintColorLight, // <-- Active
  },
  dark: {
    text: "#ECEDEE",

    //the real fucking nav background v
    background: "#FFFBF4",
    //background: '#151718',

    //navBar: navBarColor,

    //tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#D2B378", // <-- Inactive
    tabIconSelected: tintColorDark, // <-- Active
  },
};
