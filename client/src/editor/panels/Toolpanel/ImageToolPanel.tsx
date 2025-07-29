// src/components/tools/ImageToolPanel.tsx
import { Stack, Button } from "@mui/material";
import { useEditor } from "../../state/useEditor";
import type { ChangeEvent } from "react";
import { useAuthStore } from "../../../store/useAuthStore";

const ImageToolPanel = () => {
    const { createElement } = useEditor();

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        const token = useAuthStore.getState().getToken();
        formData.append("file", file);


        try {
            const response = await fetch("http://localhost:8000/upload/file", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token ?? ""}`
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Ошибка загрузки файла");

            const data = await response.json();

            // Добавляем элемент изображения на холст
            createElement("image", {
                src: data.url,
                x: 100,
                y: 100,
                width: 200,
                height: 200,
            });
        } catch (error) {
            console.error("Ошибка загрузки:", error);
        }
    };

    return (
        <Stack spacing={1}>
            <Button component="label" size="small" variant="contained">
                Загрузить изображение
                <input hidden type="file" accept="image/*" onChange={handleUpload} />
            </Button>
        </Stack>
    );
};

export default ImageToolPanel;
