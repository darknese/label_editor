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
    Typography,
    Box,
} from '@mui/material';
import { useEditor } from '../state/useEditor';
import type { Element } from '../types/types';

interface ExportTemplateDialogProps {
    open: boolean;
    onClose: () => void;
}

export const ExportTemplateDialog: React.FC<ExportTemplateDialogProps> = ({ open, onClose }) => {
    const [templateName, setTemplateName] = useState('');
    const [includeImages, setIncludeImages] = useState(true);
    const [convertToPlaceholders, setConvertToPlaceholders] = useState(false);
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
            let exportElements: Element[] = elements;

            if (convertToPlaceholders) {
                let codeCounter = 1;

                exportElements = elements.map((element): Element => {
                    if (element.type === 'datamatrix' && !element.props.isPlaceholder) {
                        const newProps = {
                            ...element.props,
                            code: `{{code${codeCounter++}}}`,
                        };

                        delete newProps.datamatrixCode;

                        return {
                            ...element,
                            props: newProps,
                        };
                    }
                    return element;
                });
            }

            const exportData = {
                name: templateName.trim(),
                version: '1.0',
                createdAt: new Date().toISOString(),
                data: {
                    elements: exportElements,
                    canvasSize: CANVAS_SIZE,
                },
                ...(includeImages && { fileUrls }),
                exportOptions: {
                    convertToPlaceholders,
                    includeImages,
                }
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
            console.error('Ошибка при экспорте шаблона:', error);
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

    const datamatrixCount = elements.filter(el => el.type === 'datamatrix').length;
    const testDatamatrixCount = elements.filter(el =>
        el.type === 'datamatrix' && !el.props.isPlaceholder
    ).length;

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

                    {datamatrixCount > 0 && (
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Datamatrix элементы: {datamatrixCount}
                            </Typography>
                            {testDatamatrixCount > 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    Тестовых: {testDatamatrixCount}
                                </Typography>
                            )}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={convertToPlaceholders}
                                        onChange={(e) => setConvertToPlaceholders(e.target.checked)}
                                    />
                                }
                                label="Конвертировать тестовые Datamatrix в {{codeN}}"
                            />
                            {convertToPlaceholders && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Каждый тестовый Datamatrix будет заменён на плейсхолдер
                                </Typography>
                            )}
                        </Box>
                    )}
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
