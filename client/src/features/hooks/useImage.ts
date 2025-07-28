import { useState, useEffect } from "react";

export function useImage(src?: string): HTMLImageElement | undefined {
    const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

    useEffect(() => {
        if (!src) {
            setImage(undefined);
            return;
        }
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => setImage(img);
        img.onerror = () => setImage(undefined);
    }, [src]);

    return image;
}
