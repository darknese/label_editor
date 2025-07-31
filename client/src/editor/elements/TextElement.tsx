// src/components/CanvasArea/TextElement.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { TextEditor } from './TextEditor';
import { useSnapping } from '../hooks/useSnapping';
import { useEditor } from '../state/useEditor';

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
    fontStyle?: string;
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
    fontStyle: string;
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
    fontStyle = 'normal',
    fontFamily = 'Arial',
    fill = '#000',
    text = 'text',
    onChange,
    onSelect,
    isSelected,
}: Props) => {
    const textRef = useRef<Konva.Text>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const [textWidth, setTextWidth] = useState(width);
    const [closeEditor, setCloseEditor] = useState(false);
    const [textHeight, setTextHeight] = useState(height);

    const [editorConfig, setEditorConfig] = useState<EditorConfig | null>(null);
    const { elements, CANVAS_SIZE, setGuidelines } = useEditor();
    const {
        editingId,
        setEditingId
    } = useEditor()

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
        if (editingId) {
            setTimeout(() => {
                stage?.container().style.setProperty('cursor', 'text');
            });
        } else {
            stage?.container().style.setProperty('cursor', 'default');
        }
    }, [editingId]);

    // Обновление высоты текста
    const updateTextHeight = useCallback(() => {
        const node = textRef.current;
        if (!node) return;
        const newHeight = node.textArr.length * node.fontSize() * 1.2; // Примерный расчет высоты
        setTextHeight(newHeight);
        onChange({ height: newHeight });
    }, [onChange]);

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
                fontStyle: node.fontStyle() || 'normal',
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
            setTimeout(() => {
                setEditingId(id);
            }, 0);
            onChange({ isEditing: true });
        }
    }, []);

    // Обработка трансформации
    const handleTransform = useCallback(() => {
        const node = textRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const newWidth = Math.max(30, node.width() * scaleX);
        const newHeight = Math.max(fontSize * 1.2, node.height() * scaleY);
        setTextWidth(newWidth);
        setTextHeight(newHeight);
        node.setAttrs({
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1,
        });
    }, [fontSize]);

    // Завершение редактирования и обновление текста
    const handleTextChange = useCallback((newText: string, newHeight?: number) => {
        console.log('сработал handleTextChange')
        console.log(newText)
        setEditingId(null)
        onChange({
            text: newText,
            height: newHeight || textRef.current?.height() || 0,
        });
        updateTextHeight();
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
                fontStyle={fontStyle}
                fill={fill}
                rotation={rotation}
                opacity={editingId === id ? 0 : 1}
                draggable
                wrap="word"
                onClick={() => {
                    onSelect();
                }}
                onDblClick={handleDoubleClick}
                onDblTap={handleDoubleClick}
                onDragMove={(e: any) => {
                    const node = e.target;
                    const box = {
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * node.scaleX(),
                        height: node.height() * node.scaleY(),
                        id: id,
                    };
                    const { snappedX, snappedY, guidelines } = useSnapping(box, elements, CANVAS_SIZE.width, CANVAS_SIZE.height);
                    node.position({ x: snappedX, y: snappedY });
                    setGuidelines(guidelines);
                }}
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
                    setGuidelines([]);
                }}
            />

            {isSelected && !editingId && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => ({
                        ...newBox,
                        width: Math.max(30, newBox.width),
                        height: Math.max(fontSize * 1.2, newBox.height),
                    })}
                />
            )}

            {editingId === id && editorConfig && (
                <TextEditor
                    config={editorConfig}
                    onChange={handleTextChange}
                    setCloseEditor={(n: boolean) => setCloseEditor(n)}
                    closeEditor={closeEditor}
                    onClose={() => {
                        setEditorConfig(null);
                        const stage = textRef.current?.getStage();
                        stage?.container().style.setProperty('cursor', 'default');
                    }}
                />
            )}
        </>
    );
};
