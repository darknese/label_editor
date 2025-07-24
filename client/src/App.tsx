import React from 'react';
import './App.css';
import { useAuthStore } from './store/useAuthStore';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { Box } from '@mui/material';


function App() {
  const { token, user, setAuth, logout } = useAuthStore();
  const [showRegister, setShowRegister] = React.useState(false);

  if (!token || !user) {
    return showRegister ? (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5">
        <RegisterForm onRegister={setAuth} onSwitchMode={() => setShowRegister(false)} />
      </Box>
    ) : (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5">
        <LoginForm onLogin={setAuth} onSwitchMode={() => setShowRegister(true)} />
      </Box>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Label Editor </h2>
        <div>
          <span style={{ marginRight: 12 }}>{user.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      {/* Здесь будет редактор этикеток */}
      <div style={{ textAlign: 'center', color: '#888', marginTop: 80 }}>
        <h3>Label editor coming soon...</h3>
      </div>
    </div>
  );
}

export default App
