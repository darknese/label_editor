
import React from 'react';
import './App.css';
import LabelEditor from './components/LabelEditor';
import { LoginForm } from './features/auth/LoginForm';
import { useAuthStore } from './store/useAuthStore';


function App() {
  const { token, user, setAuth, logout } = useAuthStore();

  if (!token || !user) {
    return <LoginForm onLogin={setAuth} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Редактор Этикетки</h2>
        <div>
          <span style={{ marginRight: 12 }}>{user.email}</span>
          <button onClick={logout}>Выйти</button>
        </div>
      </div>
      <LabelEditor />
    </div>
  );
}

export default App;
