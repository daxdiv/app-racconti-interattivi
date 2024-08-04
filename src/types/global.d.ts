declare global {
  interface DoublePageNodeData extends Record<string, unknown> {
    label: string;
    leftPageNumber: number;
    rightPageNumber: number;
    deletable: boolean;
  }
}

export {};
