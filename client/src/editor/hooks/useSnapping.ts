const MAGNET_DISTANCE = 5;

import type { Element } from "../types/types";

interface Guideline {
    value: number;
    orientation: 'vertical' | 'horizontal';
}

// Храним состояние направляющих и предыдущей позиции
let cachedVerticalGuides: number[] = [];
let cachedHorizontalGuides: number[] = [];
let lastElementsHash = '';
let prevX: number | null = null;
let prevY: number | null = null;

// Функция для бинарного поиска с учётом направления
function findClosestIndex(coordinates: number[], target: number): number {
    let left = 0;
    let right = coordinates.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (coordinates[mid] === target) return mid;
        if (coordinates[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    if (left === 0) return 0;
    if (left === coordinates.length) return coordinates.length - 1;
    return Math.abs(coordinates[left - 1] - target) < Math.abs(coordinates[left] - target) ? left - 1 : left;
}

function findClosestCoordinate(
    coordinates: number[],
    target: number,
    direction: 'left' | 'right' | 'up' | 'down' | null
): { value: number; distance: number } | null {
    if (coordinates.length === 0) return null;

    let left = 0;
    let right = coordinates.length - 1;

    if (direction) {
        const closestIndex = findClosestIndex(coordinates, target);
        if (direction === 'right' || direction === 'down') {
            left = closestIndex;
        } else if (direction === 'left' || direction === 'up') {
            right = closestIndex;
        }
    }

    let closest = coordinates[left];
    let minDistance = Math.abs(target - closest);

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const distance = Math.abs(target - coordinates[mid]);

        if (distance < minDistance) {
            minDistance = distance;
            closest = coordinates[mid];
        }

        if (coordinates[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // Проверяем соседние элементы
    for (let i = Math.max(0, left - 1); i <= Math.min(coordinates.length - 1, left + 1); i++) {
        const distance = Math.abs(target - coordinates[i]);
        if (distance < minDistance) {
            minDistance = distance;
            closest = coordinates[i];
        }
    }

    return minDistance < MAGNET_DISTANCE ? { value: closest, distance: minDistance } : null;
}

export const useSnapping = (
    currentElement: { id?: any; x?: any; y?: any; width?: any; height?: any },
    allElements: Element[],
    stageWidth: number,
    stageHeight: number
) => {
    // Проверка входных данных
    if (
        !currentElement ||
        typeof currentElement.x !== 'number' ||
        typeof currentElement.y !== 'number' ||
        typeof currentElement.width !== 'number' ||
        typeof currentElement.height !== 'number'
    ) {
        console.warn('Invalid currentElement data');
        return { snappedX: 0, snappedY: 0, guidelines: [] };
    }

    const { x, y, width, height } = currentElement;
    const cx = x + width / 2;
    const cy = y + height / 2;
    let snappedX = x;
    let snappedY = y;
    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2;

    // Обновляем кэш направляющих, если данные изменились
    const elementsHash = JSON.stringify(allElements.map(el => el.props)) + stageWidth + stageHeight;
    if (elementsHash !== lastElementsHash) {
        cachedVerticalGuides = [0, centerX, stageWidth];
        cachedHorizontalGuides = [0, centerY, stageHeight];
        for (let el of allElements) {
            if (el.id === currentElement.id) continue;
            const { x: ex, y: ey, width: ew = 10, height: eh = 10 } = el.props;
            cachedVerticalGuides.push(ex, ex + ew / 2, ex + ew);
            cachedHorizontalGuides.push(ey, ey + eh / 2, ey + eh);
        }
        cachedVerticalGuides = [...new Set(cachedVerticalGuides.sort((a, b) => a - b))];
        cachedHorizontalGuides = [...new Set(cachedHorizontalGuides.sort((a, b) => a - b))];
        lastElementsHash = elementsHash;
    }

    // Определяем направление смещения
    let xDirection: 'left' | 'right' | null = null;
    let yDirection: 'up' | 'down' | null = null;

    if (prevX !== null && prevY !== null) {
        if (x > prevX) xDirection = 'right';
        else if (x < prevX) xDirection = 'left';
        if (y > prevY) yDirection = 'down';
        else if (y < prevY) yDirection = 'up';
    }

    // Обновляем предыдущую позицию
    prevX = x;
    prevY = y;

    // Ищем ближайшие направляющие
    const xTargets = [
        { value: x, target: 'left' },
        { value: cx, target: 'center' },
        { value: x + width, target: 'right' },
    ];
    const yTargets = [
        { value: y, target: 'top' },
        { value: cy, target: 'center' },
        { value: y + height, target: 'bottom' },
    ];

    let minXDistance = MAGNET_DISTANCE;
    let minYDistance = MAGNET_DISTANCE;
    let bestXGuide: { value: number; distance: number; target: 'left' | 'center' | 'right' } | null = null;
    let bestYGuide: { value: number; distance: number; target: 'top' | 'center' | 'bottom' } | null = null;

    // Проверяем x-координаты
    for (const { value, target } of xTargets) {
        const result = findClosestCoordinate(cachedVerticalGuides, value, xDirection);
        if (result && result.distance < minXDistance) {
            minXDistance = result.distance;
            bestXGuide = { value: result.value, distance: result.distance, target: target as 'left' | 'center' | 'right' };
        }
    }

    // Проверяем y-координаты
    for (const { value, target } of yTargets) {
        const result = findClosestCoordinate(cachedHorizontalGuides, value, yDirection);
        if (result && result.distance < minYDistance) {
            minYDistance = result.distance;
            bestYGuide = { value: result.value, distance: result.distance, target: target as 'top' | 'center' | 'bottom' };
        }
    }

    // Применяем прилипание
    const guidelines: Array<{ points: number[]; orientation: 'vertical' | 'horizontal' }> = [];

    if (bestXGuide && bestXGuide.distance < MAGNET_DISTANCE) {
        if (bestXGuide.target === 'left') {
            snappedX = bestXGuide.value;
        } else if (bestXGuide.target === 'center') {
            snappedX = bestXGuide.value - width / 2;
        } else {
            snappedX = bestXGuide.value - width;
        }
        guidelines.push({ points: [bestXGuide.value, 0, bestXGuide.value, stageHeight], orientation: 'vertical' });
    }

    if (bestYGuide && bestYGuide.distance < MAGNET_DISTANCE) {
        if (bestYGuide.target === 'top') {
            snappedY = bestYGuide.value;
        } else if (bestYGuide.target === 'center') {
            snappedY = bestYGuide.value - height / 2;
        } else {
            snappedY = bestYGuide.value - height;
        }
        guidelines.push({ points: [0, bestYGuide.value, stageWidth, bestYGuide.value], orientation: 'horizontal' });
    }

    // Удаление дублирующих направляющих
    const uniqueGuidelines = new Set<string>();
    const filteredGuidelines = guidelines.filter((guideline) => {
        const key = `${guideline.orientation}:${guideline.points.join(',')}`;
        if (uniqueGuidelines.has(key)) {
            return false;
        }
        uniqueGuidelines.add(key);
        return true;
    });

    return { snappedX, snappedY, guidelines: filteredGuidelines };
};