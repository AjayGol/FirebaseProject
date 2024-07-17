/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#000000",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    lightBlue: "#4bc7f3",
    buttonBorder: "#24BBF1",
    textInputBorder: "#D1D1D1",
    orTextColor: "#696969",
    lineColor: "#3FC0EF",
    buttonGradient: ["#26BCF2", "#82DAF9"],
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    lightBlue: "#4bc7f3",
    buttonBorder: "#24BBF1",
    textInputBorder: "#D1D1D1",
    orTextColor: "#696969",
    lineColor: "#3FC0EF",
    buttonGradient: ["#26BCF2", "#82DAF9"],
  },
};
