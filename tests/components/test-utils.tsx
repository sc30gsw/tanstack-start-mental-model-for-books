import React from "react";
import { MantineProvider, AppShell } from "@mantine/core";
import { theme } from "~/lib/theme";
import { ColorSchemeContext } from "~/hooks/use-color-scheme";
import type { MantineColorScheme } from "@mantine/core";

export function TestWrapper({
  children,
  colorScheme = "light",
  withAppShell = false,
}: {
  children: React.ReactNode;
  colorScheme?: MantineColorScheme;
  withAppShell?: boolean;
}) {
  const mockSetColorScheme = () => {};

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        setColorScheme: mockSetColorScheme,
      }}
    >
      <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
        {withAppShell ? <AppShell header={{ height: 60 }}>{children}</AppShell> : children}
      </MantineProvider>
    </ColorSchemeContext.Provider>
  );
}
