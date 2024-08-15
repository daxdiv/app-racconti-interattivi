import { SheetContext } from "@/contexts/sheetContext";
import { useContext } from "react";

const useSheetContext = () => useContext(SheetContext);

export default useSheetContext;
