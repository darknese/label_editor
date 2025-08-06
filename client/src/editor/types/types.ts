

/* ---------- TYPES ---------- */
export type ElemType = 'text' | 'rect' | 'image' | 'datamatrix';

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
    src?: string; // для обратной совместимости
    fileId?: string; // новый способ хранения ID файла
    draggable: boolean;
    // Datamatrix специфичные поля
    datamatrixCode?: string;
    isPlaceholder?: boolean;
    placeholderText?: string;
  };
};

export type ToolType = "text" | "image" | "shape" | "clear" | "templates" | "datamatrix" | null;

// Типы для работы с шаблонами
export type Template = {
  id: string;
  name: string;
  description?: string;
  data: any;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type TemplateResponse = {
  template: Template;
  fileUrls: Record<string, string>; // fileId → presignedUrl
};
