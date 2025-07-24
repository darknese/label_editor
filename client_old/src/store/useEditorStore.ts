import { create } from 'zustand';
import { Element } from '../types';
import { persist } from "zustand/middleware"

interface EditorState {
  elements: Element[];
  selectedId: string | null;
  addElement: (el: Element) => void;
  updateElement: (id: string, props: any) => void;
  setSelectedId: (id: string | null) => void;
  moveLayer: (id: string, direction: "up" | "down") => void;
  deleteSelected: () => void;
}
export const useEditorStore = create<EditorState>()(
    persist<EditorState>(
        (set,get) => ({
            elements: [],
            selectedId: null,
            
            addElement: (el) =>
                set((state) => ({
                    elements: [...state.elements, el],
                })),
            
            deleteSelected: () => {
                const { selectedId, elements } = get();
                if ( !selectedId ) return
                set(() =>({
                    elements: elements.filter((el) => el.id !== selectedId),
                    selectedId: null,
                }))
            },

            updateElement: (id, newProps) =>
                set((state) => ({
                    elements: state.elements.map((el) => 
                        el.id === id
                        ? {...el, props: {...el.props, ...newProps}}
                        : el
                    ),
                })),
            setSelectedId: (id) => set({selectedId: id}),
            
            moveLayer: (id, direction) => {
                const elems = [...get().elements] 
                const index = elems.findIndex((el) => el.id === id)

                const targetIndex = 
                    direction ==="up"
                    ? Math.min(elems.length-1, index + 1)
                    : Math.max(0, index - 1);
                const temp = elems[index]
                elems[index] = elems[targetIndex]
                elems[targetIndex] = temp

                set({elements: elems})
                },
        }),
    {
        name: "label-editor"
    })
)