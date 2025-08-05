import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    Stack,
    Typography,
    Box,
} from '@mui/material';
import { useEditor } from '../state/useEditor';

interface ImportTemplateDialogProps {
    open: boolean;
    onClose: () => void;
}

export const ImportTemplateDialog: React.FC<ImportTemplateDialogProps> = ({ open, onClose }) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [importedData, setImportedData] = useState<any>(null);

    const { loadTemplate } = useEditor();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Валидация структуры файла
                if (!data.data || !data.data.elements) {
                    setError('Неверный формат файла шаблона');
                    return;
                }

                setImportedData(data);
                setError(null);
                setSuccess('Файл успешно загружен');
            } catch (error) {
                setError('Ошибка при чтении файла. Убедитесь, что это валидный JSON файл.');
            }
        };
        reader.readAsText(file);
    };

    const handleImport = () => {
        if (!importedData) {
            setError('Сначала выберите файл для импорта');
            return;
        }

        try {
            // Создаем объект TemplateResponse для совместимости
            const templateResponse = {
                template: {
                    id: 'imported',
                    name: importedData.name || 'Импортированный шаблон',
                    data: importedData.data,
                    userId: 'imported',
                    createdAt: importedData.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                fileUrls: importedData.fileUrls || {},
            };

            loadTemplate(templateResponse);
            setSuccess('Шаблон успешно импортирован');

            // Закрываем диалог через 2 секунды
            setTimeout(() => {
                onClose();
                setSuccess(null);
                setImportedData(null);
            }, 2000);
        } catch (error) {
            setError('Ошибка при импорте шаблона');
        }
    };

    const handleClose = () => {
        setError(null);
        setSuccess(null);
        setImportedData(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Импорт шаблона</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Выберите JSON файл с шаблоном для импорта
                    </Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                    >
                        Выбрать файл
                        <input
                            type="file"
                            hidden
                            accept=".json"
                            onChange={handleFileSelect}
                        />
                    </Button>

                    {importedData && (
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Информация о шаблоне:
                            </Typography>
                            <Typography variant="body2">
                                Название: {importedData.name || 'Не указано'}
                            </Typography>
                            <Typography variant="body2">
                                Элементов: {importedData.data?.elements?.length || 0}
                            </Typography>
                            {importedData.createdAt && (
                                <Typography variant="body2">
                                    Создан: {new Date(importedData.createdAt).toLocaleDateString()}
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
                    onClick={handleImport}
                    variant="contained"
                    disabled={!importedData}
                >
                    Импортировать
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 