import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    CircularProgress,
    IconButton,
    Alert,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEditor } from '../../state/useEditor';
import type { Template, TemplateResponse } from '../../types/types';
import { useAuthStore } from '../../../store/useAuthStore';

const TemplatesToolPanel = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
    const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const { loadTemplate } = useEditor();
    const { token } = useAuthStore();

    const fetchTemplates = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/templates', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const templatesData = await response.json();
                setTemplates(templatesData);
            } else {
                setError('Ошибка при загрузке шаблонов');
            }
        } catch (error) {
            console.error('Ошибка при загрузке шаблонов:', error);
            setError('Ошибка сети при загрузке шаблонов');
        } finally {
            setLoading(false);
        }
    };

    const loadTemplateById = async (templateId: string) => {
        try {
            const response = await fetch(`/templates/${templateId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const templateResponse: TemplateResponse = await response.json();
                loadTemplate(templateResponse);
            } else {
                setError('Ошибка при загрузке шаблона');
            }
        } catch (error) {
            console.error('Ошибка при загрузке шаблона:', error);
            setError('Ошибка сети при загрузке шаблона');
        }
    };

    const deleteTemplate = async (templateId: string) => {
        try {
            const response = await fetch(`/templates/${templateId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setTemplates(templates.filter(t => t.id !== templateId));
                setDeleteDialogOpen(false);
                setTemplateToDelete(null);
            } else {
                setError('Ошибка при удалении шаблона');
            }
        } catch (error) {
            console.error('Ошибка при удалении шаблона:', error);
            setError('Ошибка сети при удалении шаблона');
        }
    };

    const updateTemplate = async (templateId: string, name: string, description?: string) => {
        try {
            const response = await fetch(`/templates/${templateId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    // Не отправляем data, так как обновляем только метаданные
                }),
            });
            if (response.ok) {
                setTemplates(templates.map(t =>
                    t.id === templateId
                        ? { ...t, name, description, updatedAt: new Date().toISOString() }
                        : t
                ));
                setEditDialogOpen(false);
                setTemplateToEdit(null);
                setEditName('');
                setEditDescription('');
            } else {
                setError('Ошибка при обновлении шаблона');
            }
        } catch (error) {
            console.error('Ошибка при обновлении шаблона:', error);
            setError('Ошибка сети при обновлении шаблона');
        }
    };

    const handleDeleteClick = (template: Template) => {
        setTemplateToDelete(template);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (template: Template) => {
        setTemplateToEdit(template);
        setEditName(template.name);
        setEditDescription(template.description || '');
        setEditDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (templateToDelete) {
            deleteTemplate(templateToDelete.id);
        }
    };

    const handleEditConfirm = () => {
        if (templateToEdit && editName.trim()) {
            updateTemplate(templateToEdit.id, editName.trim(), editDescription.trim());
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Typography variant="h6" gutterBottom>
                Шаблоны
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {templates.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Шаблоны не найдены
                </Typography>
            ) : (
                <List sx={{ width: '100%' }}>
                    {templates.map((template) => (
                        <ListItem
                            key={template.id}
                            divider
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                gap: 1,
                                py: 1
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <ListItemText
                                    primary={template.name}
                                    secondary={
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2">
                                                Создан: {new Date(template.createdAt).toLocaleDateString()}
                                            </Typography>
                                            {template.description && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {template.description}
                                                </Typography>
                                            )}
                                        </Stack>
                                    }
                                />
                            </Box>
                            <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => loadTemplateById(template.id)}
                                >
                                    Применить
                                </Button>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditClick(template)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteClick(template)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Диалог подтверждения удаления */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Удалить шаблон</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить шаблон "{templateToDelete?.name}"?
                        Это действие нельзя отменить.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог редактирования */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Редактировать шаблон</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            autoFocus
                            label="Название шаблона"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Введите название шаблона"
                        />
                        <TextField
                            label="Описание (необязательно)"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Краткое описание шаблона"
                            multiline
                            rows={3}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleEditConfirm}
                        variant="contained"
                        disabled={!editName.trim()}
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TemplatesToolPanel;