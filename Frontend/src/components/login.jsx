import { useState } from 'react';
import { login } from '../api/client';
 
export default function Login({ onLogin }) {
  // Estado del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  // Estado de la UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
 
    if (!email || !password) {
      setError('Rellena el email y la contraseña.');
      return;
    }
 
    setLoading(true);
 
    try {
      const data = await login(email, password);
 
      // Guardamos los datos de sesión en el navegador
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('rol', data.rol);
      localStorage.setItem('nombre', data.nombre);
 
      // Le decimos a App.jsx que el login fue bien
      // y le pasamos el rol para que muestre el panel correcto
      onLogin(data.rol);
 
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
 
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🏭</div>
          <div>
            <div style={styles.logoText}>GestorFFEOE</div>
            <div style={styles.logoSub}>Gestión de prácticas</div>
          </div>
        </div>
 
        <h1 style={styles.title}>Iniciar sesión</h1>
        <p style={styles.subtitle}>Introduce tus credenciales para acceder</p>
 
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={styles.input}
            />
          </div>
 
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>
 
          {error && <div style={styles.error}>{error}</div>}
 
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
 
// Estilos en objeto JavaScript — equivalente a CSS normal
const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f4',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    padding: '2rem 2.25rem',
    width: '100%',
    maxWidth: '400px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '1.75rem',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: '#185FA5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  logoText: { fontSize: '15px', fontWeight: '500' },
  logoSub: { fontSize: '12px', color: '#888' },
  title: { fontSize: '20px', fontWeight: '500', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#888', marginBottom: '1.5rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' },
  input: {
    width: '100%',
    padding: '9px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  error: {
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    fontSize: '13px',
    padding: '10px 12px',
    marginBottom: '1rem',
  },
  btn: {
    width: '100%',
    padding: '10px',
    background: '#185FA5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};