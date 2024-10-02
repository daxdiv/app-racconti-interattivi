import { ThemeProviderContext } from "@/components/ThemeProvider";
import { useContext } from "react";

function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}

export default useTheme;
