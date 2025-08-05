

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
    src?: string; // для обратной совместимости
    fileId?: string; // новый способ хранения ID файла
    draggable: boolean;
  };
};

export type ToolType = "text" | "image" | "shape" | "clear" | "templates" | null;

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
