import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Stack,
} from '@mui/material';
import { useEditor } from '../state/useEditor';

interface SaveTemplateDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SaveTemplateDialog: React.FC<SaveTemplateDialogProps> = ({ open, onClose }) => {
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const { saveTemplate, elements } = useEditor();

    const handleSave = async () => {
        if (!templateName.trim()) {
            setError('Введите название шаблона');
            return;
        }

        if (templateName.length < 3) {
            setError('Название шаблона должно содержать минимум 3 символа');
            return;
        }

        if (elements.length === 0) {
            setError('Нельзя сохранить пустой шаблон');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await saveTemplate(templateName.trim(), templateDescription.trim());

            if (result.success) {
                setSuccess(result.message);
                setTemplateName('');
                setTemplateDescription('');
                setTimeout(() => {
                    onClose();
                    setSuccess(null);
                }, 2000);
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Произошла ошибка при сохранении');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setTemplateName('');
            setTemplateDescription('');
            setError(null);
            setSuccess(null);
            onClose();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSave();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Сохранить шаблон</DialogTitle>
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
                    <TextField
                        autoFocus
                        label="Название шаблона"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        placeholder="Введите название шаблона"
                        helperText="Минимум 3 символа"
                    />
                    <TextField
                        label="Описание (необязательно)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                        disabled={isLoading}
                        placeholder="Краткое описание шаблона"
                        multiline
                        rows={3}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>
                    Отмена
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={isLoading || !templateName.trim() || templateName.length < 3}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 