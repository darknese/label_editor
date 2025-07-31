import { Box, Button } from "@mui/material";
import { useEditor } from "../state/useEditor";

const TopBar = () => {
    const { stageRef } = useEditor();

    const handleExport = () => {
        if (!stageRef) {
            console.warn("Stage reference is not available");
            return;
        }

        // Экспорт холста в PNG
        const dataURL = stageRef.toDataURL({
            mimeType: 'image/png',
            quality: 1.0,
        });

        // Создание ссылки для скачивания
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'canvas-export.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box
            height="48px"
            bgcolor="#fafafa"
            borderBottom="1px solid #ccc"
            display="flex"
            alignItems="center"
            justifyContent="flex-end" // Перемещаем кнопку вправо
            px={2}
        >
            <Button variant="contained" color="primary" onClick={handleExport}>
                Download PNG
            </Button>
        </Box>
    );
};

export default TopBar;