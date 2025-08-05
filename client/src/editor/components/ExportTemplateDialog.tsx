import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    Stack,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { useEditor } from '../state/useEditor';

interface ExportTemplateDialogProps {
    open: boolean;
    onClose: () => void;
}

export const ExportTemplateDialog: React.FC<ExportTemplateDialogProps> = ({ open, onClose }) => {
    const [templateName, setTemplateName] = useState('');
    const [includeImages, setIncludeImages] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { elements, CANVAS_SIZE, fileUrls } = useEditor();

    const handleExport = () => {
        if (!templateName.trim()) {
            setError('Введите название шаблона');
            return;
        }

        if (elements.length === 0) {
            setError('Нечего экспортировать - холст пуст');
            return;
        }

        try {
            const exportData = {
                name: templateName.trim(),
                version: '1.0',
                createdAt: new Date().toISOString(),
                data: {
                    elements,
                    canvasSize: CANVAS_SIZE,
                },
                ...(includeImages && { fileUrls }),
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `${templateName.trim()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            onClose();
            setTemplateName('');
            setError(null);
        } catch (error) {
            setError('Ошибка при экспорте шаблона');
        }
    };

    const handleClose = () => {
        setTemplateName('');
        setError(null);
        onClose();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleExport();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Экспорт шаблона</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        autoFocus
                        label="Название файла"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Введите название файла"
                        helperText="Файл будет сохранен как .json"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeImages}
                                onChange={(e) => setIncludeImages(e.target.checked)}
                            />
                        }
                        label="Включить ссылки на изображения"
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Отмена
                </Button>
                <Button
                    onClick={handleExport}
                    variant="contained"
                    disabled={!templateName.trim() || elements.length === 0}
                >
                    Экспортировать
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 