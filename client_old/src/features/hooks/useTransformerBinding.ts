import { Stage } from "konva/lib/Stage";
import { Transformer } from "konva/lib/shapes/Transformer";
import { useEffect } from "react";

type Params = {
  selectedId: string | null;
  stageRef: React.RefObject<Stage>;
  trRef: React.RefObject<Transformer>;
};

export function useTransformerBinding ({selectedId, stageRef, trRef}: Params) {
    useEffect(() => {
        if (!trRef.current || !selectedId) return

        const selectedNode = stageRef.current?.findOne(`#${selectedId}`)
        if (selectedNode) {
            trRef.current.nodes([selectedNode])
            trRef.current.getLayer()?.batchDraw();
        }else{
            trRef.current.nodes([]);
        }
    })
}

