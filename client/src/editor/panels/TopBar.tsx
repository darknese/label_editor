import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useEditor } from "../state/useEditor";
import { SaveTemplateDialog } from "../components/SaveTemplateDialog";
import { ExportTemplateDialog } from "../components/ExportTemplateDialog";
import { ImportTemplateDialog } from "../components/ImportTemplateDialog";

const TopBar = () => {
    const { stageRef, elements } = useEditor();
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);

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
        <>
            <Box
                height="48px"
                bgcolor="#fafafa"
                borderBottom="1px solid #ccc"
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                px={2}
            >
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setSaveDialogOpen(true)}
                        disabled={elements.length === 0}
                    >
                        Сохранить шаблон
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setImportDialogOpen(true)}
                    >
                        Импорт JSON
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setExportDialogOpen(true)}
                        disabled={elements.length === 0}
                    >
                        Экспорт JSON
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleExport}>
                        Download PNG
                    </Button>
                </Stack>
            </Box>
            <SaveTemplateDialog
                open={saveDialogOpen}
                onClose={() => setSaveDialogOpen(false)}
            />
            <ExportTemplateDialog
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
            />
            <ImportTemplateDialog
                open={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
            />
        </>
    );
};

export default TopBar;