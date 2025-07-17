import React from 'react';
import logo from './logo.svg';
import './App.css';
import LabelEditor from './components/LabelEditor';

function App() {
  return (
  <div style={{ padding: "20px" }}>
      <h2>Редактор Этикетки</h2>
      <LabelEditor />
    </div>
  );
}

export default App;
