import { create } from 'zustand';
import { type Element, type ElemType, type TemplateResponse } from '../types/types';
import { persist } from "zustand/middleware"
import { createElement, createRect, createText } from "../utils/elementFactory";
import type Konva from 'konva';

interface EditorState {
    CANVAS_SIZE: { width: number, height: number };
    elements: Element[];
    selectedId: string | null;
    fileUrls: Record<string, string>; // fileId → presignedUrl
    setCanvasSize: (width: number, height: number) => void;
    addElement: (el: Element) => void;
    createElement: (type: ElemType, props?: any) => void;
    updateElement: (id: string, props: any) => void;
    setSelectedId: (id: string | null) => void;
    moveLayer: (direction: "up" | "down") => void;
    deleteSelected: () => void;
    duplicateElement: () => void;
    stageRef: Konva.Stage | null;
    setStageRef: (ref: Konva.Stage | null) => void;
    alignLeft: () => void;
    alignRight: () => void;
    alignCenter: () => void;
    alignTop?: () => void;
    alignBottom?: () => void;
    alignMiddle?: () => void;
    clearStore: () => void;
    guidelines: Array<{ points: number[], orientation: 'vertical' | 'horizontal' }>;
    setGuidelines: (lines: Array<{ points: number[], orientation: 'vertical' | 'horizontal' }>) => void;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    // Новые методы для работы с шаблонами
    loadTemplate: (templateResponse: TemplateResponse) => void;
    saveTemplate: (name: string, description?: string) => Promise<{ success: boolean; message: string; templateId?: string }>;
    setFileUrls: (fileUrls: Record<string, string>) => void;
    addFileUrls: (newFileUrls: Record<string, string>) => void;
    getElementSrc: (element: Element) => string | undefined;
}
export const useEditor = create<EditorState>()(

    persist<EditorState>(
        (set, get) => ({
            elements: [],
            CANVAS_SIZE: { width: 1000, height: 1000 },
            selectedId: null,
            guidelines: [],
            stageRef: null,
            fileUrls: {}, // мапа fileId → presignedUrl
            setStageRef: (ref) => set({ stageRef: ref }),
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
                    guidelines: [],
                    fileUrls: {},
                }),
            editingId: null,
            setEditingId: (id) =>
                set({
                    editingId: id
                }),


            // Новые методы для работы с шаблонами
            loadTemplate: (templateResponse: TemplateResponse) => {
                const { template, fileUrls } = templateResponse;
                console.log('template: ', template)
                console.log('fileUrls: ', fileUrls)
                set({
                    elements: template.data.elements || [],
                    fileUrls,
                });
            },
            saveTemplate: async (name: string, description?: string) => {
                try {
                    const { elements, CANVAS_SIZE, fileUrls } = get();

                    // Получаем токен из localStorage
                    const token = localStorage.getItem('token');
                    if (!token) {
                        return { success: false, message: 'Необходима авторизация' };
                    }

                    const templateData = {
                        name,
                        description,
                        data: {
                            elements,
                            canvasSize: CANVAS_SIZE,
                        },
                    };

                    // Создаем JSON файл для загрузки
                    const jsonBlob = new Blob([JSON.stringify(templateData, null, 2)], {
                        type: 'application/json',
                    });

                    const formData = new FormData();
                    formData.append('file', jsonBlob, `${name}.json`);

                    const response = await fetch('/templates/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData,
                    });

                    if (response.ok) {
                        const result = await response.json();
                        return {
                            success: true,
                            message: 'Шаблон успешно сохранен',
                            templateId: result.id
                        };
                    } else {
                        const errorData = await response.json();
                        return {
                            success: false,
                            message: errorData.message || 'Ошибка при сохранении шаблона'
                        };
                    }
                } catch (error) {
                    console.error('Ошибка при сохранении шаблона:', error);
                    return {
                        success: false,
                        message: 'Ошибка сети при сохранении шаблона'
                    };
                }
            },
            setFileUrls: (fileUrls: Record<string, string>) => {
                set({ fileUrls });
            },
            addFileUrls: (newFileUrls) => {
                set((state) => ({
                    fileUrls: {
                        ...state.fileUrls,
                        ...newFileUrls,
                    },
                }));
            },
            getElementSrc: (element: Element) => {
                const { fileUrls } = get();

                if (!element.props.fileId) return
                // Если есть fileId, возвращаем presignedUrl
                if (element.props.fileId && fileUrls[element.props.fileId]) {
                    return fileUrls[element.props.fileId];
                }
                // Для обратной совместимости возвращаем src
                return element.props.src;
            },
        }),
        {
            name: "label-editor"
        })
)