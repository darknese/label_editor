import { nanoid } from "nanoid";
import type { ElemType } from "../types/types";

export const createElement = (type: ElemType, props: any) => {
    switch (type) {
        case "text":
            return createText(nanoid(), props?.text, props);
        case "rect":
            return createRect()
        case "image":
            return createImage(props)
        default:
            throw new Error(`Unknown element type: ${type}`)
    }
}

export const createRect = (id = nanoid()) => ({
    id,
    type: "rect" as const,
    props: {
        id,
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        fill: "lightblue",
        draggable: true,
    },
});

export const createText = (id = nanoid(), text = "Текст", props: any = {}) => ({
    id,
    type: "text" as const,
    props: {
        id,
        x: 50,
        y: 50,
        text,
        fontSize: props.fontSize || 20,
        fontStyle: props.fontStyle || "normal",
        fontFamily: props.fontFamily || "Arial",
        fill: props.fill || "black",
        draggable: true,
        ...props,
    },
});

export const createImage = (fileId: string, id = nanoid()) => ({
    id,
    type: "image" as const,
    props: {
        id,
        fileId,
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        draggable: true,
        src: ''
    },
});