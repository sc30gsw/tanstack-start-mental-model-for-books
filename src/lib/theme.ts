import { createTheme, type MantineColorsTuple } from "@mantine/core";

const blue = [
  "#e7f5ff",
  "#d0ebff",
  "#a5d8ff",
  "#74c0fc",
  "#4dabf7",
  "#339af0",
  "#228be6",
  "#1c7ed6",
  "#1971c2",
  "#1864ab",
] as const satisfies MantineColorsTuple;

const violet = [
  "#f3f0ff",
  "#e5dbff",
  "#d0bfff",
  "#b197fc",
  "#9775fa",
  "#845ef7",
  "#7950f2",
  "#7048e8",
  "#6741d9",
  "#5f3dc4",
] as const satisfies MantineColorsTuple;

const yellow = [
  "#fff9db",
  "#fff3bf",
  "#ffec99",
  "#ffe066",
  "#ffd43b",
  "#fcc419",
  "#fab005",
  "#f59f00",
  "#f08c00",
  "#e67700",
] as const satisfies MantineColorsTuple;

const green = [
  "#ebfbee",
  "#d3f9d8",
  "#b2f2bb",
  "#8ce99a",
  "#69db7c",
  "#51cf66",
  "#40c057",
  "#37b24d",
  "#2f9e44",
  "#2b8a3e",
] as const satisfies MantineColorsTuple;

export const theme = createTheme({
  primaryColor: "blue",
  colors: {
    blue,
    violet,
    yellow,
    green,
  },
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif",
  headings: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif",
    sizes: {
      h1: { fontSize: "2rem", lineHeight: "1.2", fontWeight: "700" },
      h2: { fontSize: "1.75rem", lineHeight: "1.3", fontWeight: "600" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4", fontWeight: "600" },
      h4: { fontSize: "1.25rem", lineHeight: "1.4", fontWeight: "600" },
      h5: { fontSize: "1.125rem", lineHeight: "1.5", fontWeight: "600" },
      h6: { fontSize: "1rem", lineHeight: "1.5", fontWeight: "600" },
    },
  },
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
        shadow: "sm",
      },
    },
    Modal: {
      defaultProps: {
        radius: "md",
        centered: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Textarea: {
      defaultProps: {
        radius: "md",
      },
    },
    Select: {
      defaultProps: {
        radius: "md",
      },
    },
    Autocomplete: {
      defaultProps: {
        radius: "md",
      },
    },
    Badge: {
      defaultProps: {
        radius: "md",
      },
    },
    Table: {
      defaultProps: {
        highlightOnHover: true,
        striped: true,
      },
    },
  },
});
