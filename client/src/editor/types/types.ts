

/* ---------- TYPES ---------- */
export type ElemType = 'text' | 'rect' | 'image';

export type Element = {
  id: string;
  type: ElemType;
  props: {
    id: string,
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    fontSize?: number;
    fill?: string;
    src?: string;
    draggable: boolean;
  };
};

export type ToolType = "text" | "image" | "shape" | "clear" | null;
