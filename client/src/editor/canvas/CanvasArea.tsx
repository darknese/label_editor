// src/components/CanvasArea.tsx
import { Box } from "@mui/material";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { useTransformerBinding } from "../../features/hooks/useTransformerBinding";
import {
    Stage,
    Layer,
    Rect,
    Text,
    Transformer,
    Image as KonvaImage,
} from "react-konva";
import { useImage } from "../../features/hooks/useImage";
import { useEditor } from "../state/useEditor";
import { TextElement } from "../elements/TextElement";


export const CanvasArea = () => {
    const {
        elements,
        CANVAS_SIZE,
        selectedId,
        updateElement,
        setSelectedId,
        deleteSelected,
    } = useEditor();



    const stageRef = useRef<Konva.Stage>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedItem = selectedId
        ? elements.find((elem) => elem.id === selectedId)
        : null;

    useEffect(() => {
        containerRef?.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && selectedId) {
            deleteSelected();
            e.preventDefault();
        }
    };

    useTransformerBinding({ selectedId, stageRef, trRef });

    return (

        <Box
            m={'10vh auto'}
            width={CANVAS_SIZE.width}
            height={CANVAS_SIZE.height}
            bgcolor="#fff"
            boxShadow={3}
            position="relative"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            ref={containerRef}
        >
            <Stage
                width={CANVAS_SIZE.width}
                height={CANVAS_SIZE.height}
                ref={stageRef}
                style={{ border: "1px solid black" }}
                onMouseDown={(e) => {
                    if (e.target === e.target.getStage()) {
                        setSelectedId(null);
                    }
                }}
            >
                <Layer>
                    {elements.map((elem) => {
                        if (elem.type === 'text') {
                            return (
                                <TextElement
                                    key={elem.id}
                                    {...elem.props}
                                    id={elem.id}
                                    onChange={(newProps) => updateElement(elem.id, newProps)}
                                    onSelect={() => setSelectedId(elem.id)}
                                    isSelected={selectedId === elem.id}
                                />
                            );
                        } else {
                            const commonProps = {
                                ...elem.props,
                                onClick: () => setSelectedId(elem.id),
                                onDragEnd: (e: any) =>
                                    updateElement(elem.id, {
                                        x: e.target.x(),
                                        y: e.target.y(),
                                    }),
                                onTransformEnd: (e: any) => {
                                    const node = e.target;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();

                                    node.scaleX(1);
                                    node.scaleY(1);
                                    const newProps = node.attrs;
                                    console.log("UPDATED:", newProps);
                                    updateElement(elem.id, {
                                        x: newProps.x,
                                        y: newProps.y,
                                        width: node.width() * scaleX,
                                        height: node.height() * scaleY,
                                        rotation: newProps.rotation,
                                        fontSize: newProps.fontSize ? newProps.fontSize * scaleY : undefined,
                                    });
                                }

                            };
                            switch (elem.type) {
                                case "rect":
                                    return <Rect key={elem.id} {...commonProps} />;
                                case "image": {
                                    const image = useImage(elem.props.src);
                                    return <KonvaImage {...commonProps} image={image} />;
                                }
                                default:
                                    return null;
                            }
                        }
                    })}
                    {selectedId && <Transformer ref={trRef} />}
                </Layer>
            </Stage>
        </Box>

    );
};

export default CanvasArea;
