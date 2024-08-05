import { createContext } from "react";

export type SheetContextType = {
  isSheetOpen: boolean;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultAccordionValue: DoublePageNodeLabel;
  setDefaultAccordionValue: React.Dispatch<React.SetStateAction<DoublePageNodeLabel>>;
};

export const SheetContext = createContext<SheetContextType>({
  isSheetOpen: false,
  setIsSheetOpen: () => {},
  defaultAccordionValue: "Pagine 1/2",
  setDefaultAccordionValue: () => {},
});
export const SheetContextProvider = SheetContext.Provider;
