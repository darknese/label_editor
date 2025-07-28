import React from 'react';
import './App.css';
import { useAuthStore } from './store/useAuthStore';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AppHeader } from './components/AppHeader';
import EditorShell from './editor/EditorShell';

function App() {
  const { token, user, setAuth, logout } = useAuthStore();
  const [showRegister, setShowRegister] = React.useState(false);

  return (
    <Box >
      <AppHeader />

      {!token || !user ? (
        <Box
          className="main-content"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="calc(100vh - 48px)"
          bgcolor="#f5f5f5"
          p={2}
        >
          {showRegister ? (
            <RegisterForm onRegister={setAuth} onSwitchMode={() => setShowRegister(false)} />
          ) : (
            <LoginForm onLogin={setAuth} onSwitchMode={() => setShowRegister(true)} />
          )}
        </Box>
      ) : (
        <Box>
          <EditorShell />
        </Box>
      )}
    </Box>
  );
}

export default App;
