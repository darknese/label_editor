import { useEffect, type RefObject } from "react";
import Konva from "konva";

type Params = {
    selectedId: string | null;
    stageRef: RefObject<Konva.Stage | null>;
    trRef: RefObject<Konva.Transformer | null>;
};

export function useTransformerBinding({ selectedId, stageRef, trRef }: Params) {
    useEffect(() => {
        if (!selectedId) return;
        if (!stageRef.current) {
            console.warn("stageRef.current is null");
            return;
        }
        if (!trRef.current) {
            console.warn("trRef.current is null");
            return;
        }

        try {
            const node = stageRef.current.findOne(`#${selectedId}`);
            if (node) {
                trRef.current.nodes([node]);
                trRef.current.getLayer()?.batchDraw();
            } else {
                trRef.current.nodes([]);
            }
        } catch (error) {
            console.error("Error in useTransformerBinding:", error);
        }
    }, [selectedId, stageRef, trRef]);
}
