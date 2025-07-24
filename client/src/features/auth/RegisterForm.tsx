import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';

interface RegisterFormProps {
    onRegister: (token: string, user: any) => void;
    onSwitchMode?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, firstName, lastName }),
            });
            if (!res.ok) {
                let msg = 'Registration failed';
                try {
                    const data = await res.json();
                    msg = data.message || msg;
                } catch { }
                if (res.status === 409) {
                    msg = 'Email уже занят';
                }
                throw new Error(msg);
            }
            const data = await res.json();
            onRegister(data.access_token, data.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
            <Paper elevation={3} sx={{ p: 4, minWidth: 340 }}>
                <Typography variant="h5" mb={2} align="center">Регистрация</Typography>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                    <TextField
                        label="Имя"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Фамилия"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mt: 1 }}>
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                    {onSwitchMode && (
                        <Button onClick={onSwitchMode} color="primary" sx={{ mt: 0 }} style={{ textTransform: 'none' }}>
                            Уже есть аккаунт? Войти
                        </Button>
                    )}
                </form>
            </Paper>
        </Box>
    );
};
