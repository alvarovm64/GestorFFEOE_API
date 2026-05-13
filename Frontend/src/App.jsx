import { useState } from 'react';
import Login from './components/login';
import AdminPanel from './components/AdminPanel';
import ProfesorPanel from './components/ProfesorPanel';
import AlumnoPanel from './components/AlumnoPanel';

export default function App() {
  const [rol, setRol] = useState(localStorage.getItem('rol') || null);

  function handleLogin(rolRecibido) {
    setRol(rolRecibido);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    setRol(null);
  }

  if (!rol) {
    return <Login onLogin={handleLogin} />;
  }

  if (rol === 'admin') {
    return <AdminPanel onLogout={handleLogout} />;
  }

  if (rol === 'profesor') {
    return <ProfesorPanel onLogout={handleLogout} />;
  }

  if (rol === 'alumno') {
    return <AlumnoPanel onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} />;
}