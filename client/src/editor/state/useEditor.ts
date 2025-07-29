import { create } from 'zustand';
import { type Element, type ElemType } from '../types/types';
import { persist } from "zustand/middleware"
import { createElement, createRect, createText } from "../utils/elementFactory";

interface EditorState {
    CANVAS_SIZE: { width: number, height: number };
    elements: Element[];
    selectedId: string | null;
    setCanvasSize: (width: number, height: number) => void;
    addElement: (el: Element) => void;
    createElement: (type: ElemType, props?: any) => void;
    addRect: () => void;
    addText: () => void;
    updateElement: (id: string, props: any) => void;
    setSelectedId: (id: string | null) => void;
    moveLayer: (direction: "up" | "down") => void;
    deleteSelected: () => void;
    duplicateElement: () => void;
    alignLeft: () => void;
    alignRight: () => void;
    alignCenter: () => void;
    alignTop?: () => void;
    alignBottom?: () => void;
    alignMiddle?: () => void;
    clearStore: () => void;
    guidelines: Array<{ points: number[], orientation: 'vertical' | 'horizontal' }>;
    setGuidelines: (lines: Array<{ points: number[], orientation: 'vertical' | 'horizontal' }>) => void;
}
export const useEditor = create<EditorState>()(

    persist<EditorState>(
        (set, get) => ({
            elements: [],
            CANVAS_SIZE: { width: 1000, height: 1000 },
            selectedId: null,
            guidelines: [],
            setGuidelines: (lines) => set({ guidelines: lines }),

            addElement: (el) =>
                set((state) => ({
                    elements: [...state.elements, el],
                })),

            setCanvasSize: (width, height) =>
                set(() => ({
                    CANVAS_SIZE: { width, height }
                })),

            createElement: (type, props) =>
                set((state) => ({
                    elements: [...state.elements, createElement(type, props)],
                })),

            addRect: () =>
                set((state) => ({
                    elements: [...state.elements, createRect()],
                })),

            addText: () =>
                set((state) => ({
                    elements: [...state.elements, createText()],
                })),

            deleteSelected: () => {
                const { selectedId, elements } = get();
                if (!selectedId) return
                set(() => ({
                    elements: elements.filter((el) => el.id !== selectedId),
                    selectedId: null,
                }))
            },

            updateElement: (id, newProps) =>
                set((state) => ({
                    elements: state.elements.map((el) =>
                        el.id === id
                            ? { ...el, props: { ...el.props, ...newProps } }
                            : el
                    ),
                })),

            setSelectedId: (id) => set({ selectedId: id }),

            moveLayer: (direction) => {
                const elems = [...get().elements]
                const index = elems.findIndex((el) => el.id === get().selectedId)

                const targetIndex =
                    direction === "up"
                        ? Math.min(elems.length - 1, index + 1)
                        : Math.max(0, index - 1);
                const temp = elems[index]
                elems[index] = elems[targetIndex]
                elems[targetIndex] = temp

                set({ elements: elems })
            },
            alignLeft: () => {
                const { selectedId, elements } = get();
                if (!selectedId) return;
                set((state) => ({
                    elements: state.elements.map((el) =>
                        el.id === selectedId
                            ? { ...el, props: { ...el.props, x: 0 } }
                            : el
                    ),
                }));
            },
            alignRight: () => {
                const { selectedId, elements } = get();
                if (!selectedId) return;

                set((state) => ({
                    elements: state.elements.map((el) =>
                        el.id === selectedId && el.props.width
                            ? { ...el, props: { ...el.props, x: state.CANVAS_SIZE.width - el.props.width } }
                            : el
                    ),
                }));
            },
            alignCenter: () => {
                const { selectedId, elements } = get();
                if (!selectedId) return;
                set((state) => ({
                    elements: state.elements.map((el) =>
                        el.id === selectedId && el.props.width
                            ? { ...el, props: { ...el.props, x: (state.CANVAS_SIZE.width - el.props.width) / 2 } }
                            : el
                    ),
                }));
            },


            duplicateElement: () => {
                const { selectedId, elements } = get();
                if (!selectedId) return;
                const elementToDuplicate = elements.find(el => el.id === selectedId);
                if (!elementToDuplicate) return;
                const newId = crypto.randomUUID();
                const newElement = {
                    id: newId,
                    type: elementToDuplicate.type,
                    props: {
                        ...elementToDuplicate.props,
                        id: newId,
                    }
                };
                set((state) => ({
                    elements: [...state.elements, newElement],
                    selectedId: newElement.id,
                }));
            },
            clearStore: () =>
                set({
                    elements: [],
                    CANVAS_SIZE: { width: 1000, height: 1000 },
                    selectedId: null,
                }),
        }),
        {
            name: "label-editor"
        })
)