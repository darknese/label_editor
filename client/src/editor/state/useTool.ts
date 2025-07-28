import { create } from "zustand";
import type { ToolType } from "../types/types";

interface ToolStore {
    activeTool: ToolType;
    setTool: (tool: ToolType) => void;
}

export const useTool = create<ToolStore>((set) => ({
    activeTool: null,
    setTool: (tool) => {
        console.log(tool)
        set({ activeTool: tool })
    },
}));
