import { useRef, useEffect, useState, useCallback } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { useEditor } from '../state/useEditor';

interface TextElementProps {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fontFamily: string;
    fill: string;
}

export const TextElement = ({
    id,
    x,
    y,
    text,
    fontSize,
    fontFamily,
    fill,
}: TextElementProps) => {
    const textRef = useRef<Konva.Text>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { selectedId, setSelectedId, updateElement } = useEditor();

    const handleDblClick = () => {
        setIsEditing(true);
    };

    const handleTextChange = (newText: string) => {
        updateElement(id, { text: newText });
    };

    const handleClose = () => {
        setIsEditing(false);
    };

    useEffect(() => {
        if (trRef.current && textRef.current && selectedId === id) {
            trRef.current.nodes([textRef.current]);
        }
    }, [selectedId]);

    return (
        <>
            {!isEditing && (
                <>
                    <Text
                        ref={textRef}
                        x={x}
                        y={y}
                        text={text}
                        fontSize={fontSize}
                        fontFamily={fontFamily}
                        fill={fill}
                        draggable
                        onClick={() => setSelectedId(id)}
                        onDblClick={handleDblClick}
                        onTransformEnd={(e) => {
                            const node = textRef.current;
                            if (!node) return;
                            updateElement(id, {
                                width: node.width() * node.scaleX(),
                            });
                            node.scaleX(1);
                        }}
                    />
                    {selectedId === id && (
                        <Transformer
                            ref={trRef}
                            boundBoxFunc={(oldBox, newBox) => ({
                                ...newBox,
                                width: Math.max(30, newBox.width),
                            })}
                        />
                    )}
                </>
            )}
            {isEditing && textRef.current && (
                <TextEditor
                    textNode={textRef.current}
                    onChange={handleTextChange}
                    onClose={handleClose}
                />
            )}
        </>
    );
};
