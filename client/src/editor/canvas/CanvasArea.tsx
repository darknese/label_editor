// src/components/CanvasArea.tsx
import { Box } from "@mui/material";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { useTransformerBinding } from "../hooks/useTransformerBinding";
import {
    Stage,
    Layer,
    Rect,
    Text,
    Transformer,
    Image as KonvaImage,
    Line,
} from "react-konva";
import { useImage } from "../hooks/useImage";
import { useEditor } from "../state/useEditor";
import { TextElement } from "../elements/TextElement";
import { useSnapping } from "../hooks/useSnapping";
import { ImageElement } from "../elements/ImageElement";


export const CanvasArea = () => {
    const {
        elements,
        CANVAS_SIZE,
        selectedId,
        updateElement,
        setSelectedId,
        deleteSelected,
        guidelines,
        setGuidelines,
        editingId
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
            const selectedElement = elements.find((elem) => elem.id === selectedId);
            // Проверяем, является ли элемент текстовым и находится ли он в режиме редактирования
            if (selectedElement?.type === "text" && editingId) {
                // Если редактируется текст, позволяем стандартному поведению Backspace
                return;
            }
            // В обычном режиме удаляем элемент
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
                                    onChange={(newProps) => {
                                        console.log(newProps)
                                        updateElement(elem.id, newProps)
                                    }}
                                    onSelect={() => setSelectedId(elem.id)}
                                    isSelected={selectedId === elem.id}
                                />
                            );
                        } else {
                            const commonProps = {
                                ...elem.props,
                                onClick: () => setSelectedId(elem.id),
                                onDragMove: (e: any) => {
                                    const node = e.target;
                                    const box = {
                                        x: node.x(),
                                        y: node.y(),
                                        width: node.width() * node.scaleX(),
                                        height: node.height() * node.scaleY(),
                                        id: elem.id,
                                    };

                                    const { snappedX, snappedY, guidelines } = useSnapping(box, elements, CANVAS_SIZE.width, CANVAS_SIZE.height);

                                    node.position({ x: snappedX, y: snappedY });
                                    setGuidelines(guidelines);
                                },
                                onDragEnd: (e: any) => {
                                    updateElement(elem.id, {
                                        x: e.target.x(),
                                        y: e.target.y(),
                                    });
                                    setGuidelines([]);
                                },
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
                                case "image":
                                    {
                                        if (!elem.props.src) {
                                            console.warn(`ImageElement with id ${elem.id} has no src`);
                                            return null;
                                        }
                                        return (
                                            <ImageElement
                                                key={elem.id}
                                                id={elem.id}
                                                src={elem.props.src}
                                                props={elem.props}
                                                isSelected={selectedId === elem.id}
                                                onClick={commonProps.onClick}
                                                onDragMove={commonProps.onDragMove}
                                                onDragEnd={commonProps.onDragEnd}
                                                onTransformEnd={commonProps.onTransformEnd}
                                            />
                                        );
                                    }
                                default:
                                    return null;
                            }
                        }
                    })}
                    {selectedId && <Transformer ref={trRef} />}
                </Layer>
                <Layer listening={false}>
                    {guidelines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="rgba(0,0,255,0.5)"
                            strokeWidth={1}
                            dash={[4, 4]}
                        />
                    ))}
                </Layer>
            </Stage>
        </Box>

    );
};

export default CanvasArea;
