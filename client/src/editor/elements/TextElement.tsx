// src/components/CanvasArea/TextElement.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { TextEditor } from './TextEditor';

interface Props {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
    text?: string;
    onChange: (newProps: any) => void;
    onSelect: () => void;
    isSelected: boolean;
}
export interface EditorConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
    text: string;
    align: string;
    rotation: number;
    padding: number;
}

export const TextElement = ({
    id,
    x,
    y,
    width = 200,
    height,
    rotation = 0,
    fontSize = 20,
    fontFamily = 'Arial',
    fill = '#000',
    text = 'text',
    onChange,
    onSelect,
    isSelected,
}: Props) => {
    const textRef = useRef<Konva.Text>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [textWidth, setTextWidth] = useState(width);

    const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);

    // Привязка трансформера к тексту
    useEffect(() => {
        if (isSelected && trRef.current && textRef.current) {
            trRef.current.nodes([textRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    // Установка курсора при редактировании
    useEffect(() => {
        const stage = textRef.current?.getStage();
        if (isEditing) {
            setTimeout(() => {
                stage?.container().style.setProperty('cursor', 'text');
            });
        } else {
            stage?.container().style.setProperty('cursor', 'default');
        }
    }, [isEditing]);

    // Обработка двойного клика
    const handleDoubleClick = useCallback(() => {
        console.log("Double click on text element:", id);
        const node = textRef.current;
        if (node) {
            // 1. Считываем все данные ДО того, как скрыть текст
            const config: EditorConfig = {
                x: node.getAbsolutePosition().x,
                y: node.getAbsolutePosition().y,
                width: node.width(),
                height: node.height(),
                fontSize: node.fontSize(),
                fontFamily: node.fontFamily(),
                fill: node.fill() as string,
                text: node.text(),
                align: node.align(),
                rotation: node.rotation(),
                padding: node.padding(),
            };
            // 2. Сохраняем конфиг в стейт
            setEditorConfig(config);
            // 3. Включаем режим редактирования
            setIsEditing(true);
            onChange({ isEditing: true });
        }
    }, []);

    // Обработка трансформации
    const handleTransform = useCallback(() => {
        const node = textRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const newWidth = Math.max(30, node.width() * scaleX);
        setTextWidth(newWidth);
        node.setAttrs({ width: newWidth, scaleX: 1 });
    }, []);

    // Завершение редактирования и обновление текста
    const handleTextChange = useCallback((newText: string) => {
        onChange({ text: newText, isEditing: false });
    }, [onChange]);


    return (
        <>
            <Text
                ref={textRef}
                text={text}
                x={x}
                y={y}
                width={textWidth}
                height={height}
                fontSize={fontSize}
                fontFamily={fontFamily}
                fill={fill}
                rotation={rotation}
                opacity={isEditing ? 0 : 1}
                draggable
                onClick={() => {
                    onSelect();
                }}
                onDblClick={handleDoubleClick}
                onDblTap={handleDoubleClick}
                onTransform={handleTransform}
                onTransformEnd={(e: any) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);
                    const newProps = {
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * scaleX,
                        height: node.height() * scaleY,
                        rotation: node.rotation(),
                        fontSize: node.fontSize() ? node.fontSize() * scaleY : undefined,
                    };
                    onChange(newProps);
                }}
                onDragEnd={() => {
                    onChange({
                        x: textRef.current?.x() || 0,
                        y: textRef.current?.y() || 0,
                        width: textRef.current?.width() || 0,
                        height: textRef.current?.height() || 0,
                    });
                }}
            />

            {isSelected && !isEditing && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => ({
                        ...newBox,
                        width: Math.max(30, newBox.width),
                    })}
                />
            )}

            {isEditing && editorConfig && (
                <TextEditor
                    config={editorConfig}
                    onChange={handleTextChange}
                    onClose={() => {
                        setIsEditing(false);
                        setEditorConfig(null); // Очищаем конфиг при выходе
                        const stage = textRef.current?.getStage();
                        stage?.container().style.setProperty('cursor', 'default');

                    }}
                />
            )}
        </>
    );
};
