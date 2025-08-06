import React, { useEffect, useRef, useState } from 'react';
import { Group, Rect, Text, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import bwipjs from 'bwip-js';
import { useEditor } from '../state/useEditor';

interface Props {
    element: any;
    isSelected: boolean;
    onClick: () => void;
    onDragMove: (e: any) => void;
    onDragEnd: (e: any) => void;
}

// Тестовый код GS1
const generateTestDatamatrix = (): string => {
    const gtin = '12345678901234';
    const serial = '123456';
    return `(01)${gtin}(21)${serial}`;
};

export const DatamatrixElement = ({
    element,
    isSelected,
    onClick,
    onDragMove,
    onDragEnd,
}: Props) => {
    const { updateElement } = useEditor();
    const groupRef = useRef<any>(null);

    const {
        x,
        y,
        width,
        height,
        datamatrixCode,
        isPlaceholder = false,
        placeholderText = 'Datamatrix GS1',
    } = element.props;

    const [barcodeUrl, setBarcodeUrl] = useState<string>('');
    const [image] = useImage(barcodeUrl || '');

    useEffect(() => {
        if (isPlaceholder) {
            setBarcodeUrl('');
            return;
        }

        const code = datamatrixCode || generateTestDatamatrix();
        const canvas = document.createElement('canvas');

        try {
            bwipjs.toCanvas(canvas, {
                bcid: 'datamatrix',
                text: code,
                scale: 3,
                includetext: false,
                paddingwidth: 0,
                paddingheight: 0,
            });

            setBarcodeUrl(canvas.toDataURL());
        } catch (err) {
            console.error('Ошибка генерации DataMatrix:', err);
            setBarcodeUrl('');
        }
    }, [datamatrixCode, isPlaceholder]);

    // 📏 Фикс трансформации
    const handleTransformEnd = () => {
        if (!groupRef.current) return;

        const node = groupRef.current;
        const box = node.getClientRect();
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);

        console.log('💾 Сохраняем размеры:', box.width, box.height);
        updateElement(element.id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(5, box.width),
            height: Math.max(5, box.height),
        });
    };

    return (
        <Group
            id={element.id}
            ref={groupRef}
            x={x}
            y={y}
            draggable
            onClick={onClick}
            onTap={onClick}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            onTransformEnd={handleTransformEnd} // заменяем переданный
        >
            {/* Фон */}
            <Rect
                width={width}
                height={height}
                fill={isPlaceholder ? '#f0f0f0' : '#ffffff'}
                stroke={isSelected ? '#2196f3' : '#000000'}
                strokeWidth={isSelected ? 2 : 1}
                cornerRadius={2}
            />

            {/* Контент */}
            {isPlaceholder ? (
                <Text
                    x={5}
                    y={height / 2 - 8}
                    width={width - 10}
                    text={placeholderText}
                    fontSize={Math.min(12, height / 4)}
                    fontFamily="monospace"
                    fill="#999"
                    align="center"
                    verticalAlign="middle"
                />
            ) : (
                image && (
                    <KonvaImage
                        image={image}
                        width={width}
                        height={height}
                    />
                )
            )}

            {/* Метка */}
            <Text
                x={5}
                y={5}
                text={isPlaceholder ? 'PLACEHOLDER' : 'TEST'}
                fontSize={8}
                fill={isPlaceholder ? '#4caf50' : '#ff6b6b'}
                fontStyle="italic"
            />
        </Group>
    );
};
