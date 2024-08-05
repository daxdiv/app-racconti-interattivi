import { createContext } from "react";

export type SheetContextType = {
  isSheetOpen: boolean;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SheetContext = createContext<SheetContextType>({
  isSheetOpen: false,
  setIsSheetOpen: () => {},
});
export const SheetContextProvider = SheetContext.Provider;
