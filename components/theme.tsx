"use client";
/** MUI theme matching the Cake Delight palette + App Router emotion cache */
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: "#e63c64", dark: "#d02a56" },
    secondary: { main: "#3b241f" },
    success: { main: "#3fae6a" },
    error: { main: "#e05252" },
    background: { default: "#fdf6f2", paper: "#ffffff" },
    text: { primary: "#402c26", secondary: "#7d6a63" },
  },
  typography: {
    fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
    MuiButton: { styleOverrides: { root: { borderRadius: 999, boxShadow: "none" } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
  },
});

export default function MuiProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "cd" }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}
