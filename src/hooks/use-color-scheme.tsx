import { createContext, useContext } from "react";
import type { MantineColorScheme } from "@mantine/core";

type ColorSchemeContextType = {
  colorScheme: MantineColorScheme;
  setColorScheme: (
    colorScheme: MantineColorScheme | ((current: MantineColorScheme) => MantineColorScheme),
  ) => void;
};

export const ColorSchemeContext = createContext<ColorSchemeContextType | null>(null);

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);

  if (!context) {
    throw new Error("useColorScheme must be used within ColorSchemeContext.Provider");
  }

  return context;
}
