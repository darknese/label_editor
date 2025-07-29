// src/elements/ImageElement.tsx
import { Image as KonvaImage } from "react-konva";
import { useImage } from "../hooks/useImage";

interface Props {
    id: string;
    src: string;
    props: any;
    isSelected: boolean;
    onClick: () => void;
    onDragMove: (e: any) => void;
    onDragEnd: (e: any) => void;
    onTransformEnd: (e: any) => void;
}

export const ImageElement = ({
    id,
    src,
    props,
    isSelected,
    onClick,
    onDragMove,
    onDragEnd,
    onTransformEnd,
}: Props) => {
    const image = useImage(src);

    return (
        <KonvaImage
            {...props}
            image={image}
            onClick={onClick}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            onTransformEnd={onTransformEnd}
        />
    );
};
