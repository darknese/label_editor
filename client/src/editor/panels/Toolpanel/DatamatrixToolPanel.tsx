import React, { useState } from 'react';
import {
    Stack,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import { useEditor } from '../../state/useEditor';

const DatamatrixToolPanel = () => {
    const { createElement } = useEditor();
    const [datamatrixCode, setDatamatrixCode] = useState('');
    const [isPlaceholder, setIsPlaceholder] = useState(false);
    const [placeholderText, setPlaceholderText] = useState('Datamatrix GS1');
    const [error, setError] = useState<string | null>(null);

    // Функция для генерации тестового Datamatrix GS1
    const generateTestDatamatrix = (): string => {
        const gtin = '12345678901234';
        const serial = '123456';
        return `(01)${gtin}(21)${serial}`;
    };

    // Функция для валидации Datamatrix GS1
    const validateDatamatrixGS1 = (code: string): boolean => {
        const gs1Pattern = /^\(01\)\d{14}(\(21\)\d{1,20})?$/;
        return gs1Pattern.test(code);
    };

    const handleCreateTestDatamatrix = () => {
        const testCode = generateTestDatamatrix();
        createElement('datamatrix', {
            datamatrixCode: testCode,
            isPlaceholder: false,
        });
    };

    const handleCreatePlaceholder = () => {
        createElement('datamatrix', {
            isPlaceholder: true,
            placeholderText,
        });
    };

    const handleCreateCustomDatamatrix = () => {
        if (!datamatrixCode.trim()) {
            setError('Введите код Datamatrix');
            return;
        }

        if (!validateDatamatrixGS1(datamatrixCode.trim())) {
            setError('Неверный формат Datamatrix GS1. Ожидается формат: (01)12345678901234(21)123456');
            return;
        }

        createElement('datamatrix', {
            datamatrixCode: datamatrixCode.trim(),
            isPlaceholder: false,
        });

        setDatamatrixCode('');
        setError(null);
    };

    const handlePlaceholderTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceholderText(e.target.value);
    };

    return (
        <Box p={2}>
            <Typography variant="h6" gutterBottom>
                Datamatrix GS1
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Stack spacing={2}>
                {/* Создание тестового Datamatrix */}
                <Button
                    variant="contained"
                    onClick={handleCreateTestDatamatrix}
                    fullWidth
                >
                    Создать тестовый Datamatrix
                </Button>

                {/* Создание placeholder */}
                <Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPlaceholder}
                                onChange={(e) => setIsPlaceholder(e.target.checked)}
                            />
                        }
                        label="Создать placeholder"
                    />
                    {isPlaceholder && (
                        <TextField
                            label="Текст placeholder"
                            value={placeholderText}
                            onChange={handlePlaceholderTextChange}
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                        />
                    )}
                    {isPlaceholder && (
                        <Button
                            variant="outlined"
                            onClick={handleCreatePlaceholder}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Создать placeholder
                        </Button>
                    )}
                </Box>

                {/* Создание кастомного Datamatrix */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Кастомный Datamatrix GS1:
                    </Typography>
                    <TextField
                        label="Код Datamatrix"
                        value={datamatrixCode}
                        onChange={(e) => setDatamatrixCode(e.target.value)}
                        placeholder="(01)12345678901234(21)123456"
                        size="small"
                        fullWidth
                        helperText="Формат: (01)GTIN(21)Serial"
                    />
                    <Button
                        variant="outlined"
                        onClick={handleCreateCustomDatamatrix}
                        fullWidth
                        sx={{ mt: 1 }}
                        disabled={!datamatrixCode.trim()}
                    >
                        Создать кастомный
                    </Button>
                </Box>

                {/* Информация о формате */}
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Формат Datamatrix GS1:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • (01) - GTIN (14 цифр)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        • (21) - Серийный номер (1-20 цифр)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Пример: (01)12345678901234(21)123456
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default DatamatrixToolPanel; 