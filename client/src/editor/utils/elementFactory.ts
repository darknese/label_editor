import { nanoid } from "nanoid";
import type { ElemType } from "../types/types";

export const createElement = (type: ElemType, props: any) => {
    switch (type) {
        case "text":
            return createText()
        case "rect":
            return createRect()
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

export const createText = (id = nanoid(), text = "Текст") => ({
    id,
    type: "text" as const,
    props: {
        id,
        x: 50,
        y: 50,
        text,
        fontSize: 20,
        fill: "black",
        draggable: true,
    },
});
