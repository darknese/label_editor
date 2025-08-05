// src/components/tools/ImageToolPanel.tsx
import { Stack, Button } from "@mui/material";
import { useEditor } from "../../state/useEditor";
import type { ChangeEvent } from "react";
import { useAuthStore } from "../../../store/useAuthStore";

const ImageToolPanel = () => {
    const { createElement, addFileUrls } = useEditor();

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        const token = useAuthStore.getState().getToken();
        formData.append("file", file);
        try {
            const uploadResponse = await fetch("/files/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token ?? ""}`
                },
                body: formData,
            });

            if (!uploadResponse.ok) throw new Error("Ошибка загрузки файла");
            const uploadedFile = await uploadResponse.json();

            const presignedResponse = await fetch(`/files/${uploadedFile.id}/presigned`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token ?? ""}`
                },
            });
            if (!presignedResponse.ok) throw new Error("Ошибка получения presigned url");
            const { url: presignedUrl } = await presignedResponse.json();

            // 1. Добавляем fileId в store fileUrls
            addFileUrls({ [uploadedFile.id]: presignedUrl })

            // 2. Добавляем элемент изображения с fileId
            createElement("image", uploadedFile.id);
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
