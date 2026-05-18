// ─────────────────────────────────────────────────────────────
//  components/index.jsx  –  Piezas reutilizables
//
//  En lugar de repetir el mismo código en cada pantalla,
//  lo escribimos una vez aquí y lo importamos donde lo
//  necesitemos. Esto se llama DRY (Don't Repeat Yourself).
// ─────────────────────────────────────────────────────────────
 
import { useState, useEffect } from 'react';
 
// ─── SIDEBAR ─────────────────────────────────────────────────
// Barra lateral con navegación. Recibe:
//   - color:    color de acento del rol (azul/verde/morado)
//   - icon:     emoji o carácter para el logo
//   - rol:      texto que aparece bajo el logo
//   - items:    array de { id, label, icon } para los botones
//   - active:   id de la sección activa
//   - onChange: función que se llama al pulsar un botón
 
export function Sidebar({ color, icon, rol, items, active, onChange, onLogout }) {
  return (
    <aside style={{ ...sidebarStyles.sidebar }}>
      <div style={sidebarStyles.logo}>
        <div style={{ ...sidebarStyles.logoIcon, background: color }}>{icon}</div>
        <div>
          <div style={sidebarStyles.logoTitle}>GestorFFEOE</div>
          <div style={sidebarStyles.logoRole}>{rol}</div>
        </div>
      </div>
 
      <div style={sidebarStyles.navLabel}>Gestión</div>
 
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          style={{
            ...sidebarStyles.navItem,
            ...(active === item.id ? { ...sidebarStyles.navItemActive, color } : {}),
          }}
        >
          <span>{item.icon}</span> {item.label}
        </button>
      ))}
 
      <button onClick={onLogout} style={sidebarStyles.logoutBtn}>
        ↩ Cerrar sesión
      </button>
    </aside>
  );
}
 
const sidebarStyles = {
  sidebar: {
    width: '200px',
    minWidth: '200px',
    borderRight: '1px solid #e5e5e5',
    padding: '1.5rem 1rem',
    background: '#fafaf9',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' },
  logoIcon: { width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#fff' },
  logoTitle: { fontSize: '13px', fontWeight: '500' },
  logoRole: { fontSize: '11px', color: '#888' },
  navLabel: { fontSize: '11px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', padding: '0 8px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '8px',
    width: '100%', padding: '7px 8px',
    border: 'none', borderRadius: '8px',
    fontSize: '13px', color: '#666',
    cursor: 'pointer', background: 'transparent',
    textAlign: 'left', marginBottom: '2px',
  },
  navItemActive: { background: '#fff', fontWeight: '500' },
  logoutBtn: {
    marginTop: 'auto', paddingTop: '1rem',
    background: 'transparent', border: 'none',
    fontSize: '12px', color: '#aaa', cursor: 'pointer',
    textAlign: 'left', padding: '8px',
  },
};
 
// ─── ALERT ───────────────────────────────────────────────────
// Mensaje de éxito o error que desaparece solo.
// Uso: <Alert msg="Creado" type="success" />
//      <Alert msg="Error"  type="error" />
 
export function Alert({ msg, type }) {
  if (!msg) return null;
 
  const isSuccess = type === 'success';
  return (
    <div style={{
      padding: '10px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      marginBottom: '1rem',
      background: isSuccess ? '#f0fdf4' : '#fef2f2',
      color: isSuccess ? '#166534' : '#b91c1c',
      border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`,
    }}>
      {msg}
    </div>
  );
}
 
// ─── USE ALERT ───────────────────────────────────────────────
// Hook personalizado para gestionar alertas con auto-cierre.
// Devuelve [mensaje, tipo, función para mostrar alerta]
// Uso:
//   const [alertMsg, alertType, showAlert] = useAlert();
//   showAlert('Guardado', 'success');
//   <Alert msg={alertMsg} type={alertType} />
 
export function useAlert(duration = 4000) {
  const [alert, setAlert] = useState({ msg: '', type: '' });
 
  function showAlert(msg, type) {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: '', type: '' }), duration);
  }
 
  return [alert.msg, alert.type, showAlert];
}
 
// ─── CARD ────────────────────────────────────────────────────
// Contenedor con borde redondeado. Recibe children y title opcional.
 
export function Card({ title, children, headerAction }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1rem',
    }}>
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{title}</span>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  );
}
 
// ─── UPLOAD ZONE ─────────────────────────────────────────────
// Zona de arrastrar/soltar o clic para subir ficheros.
 
export function UploadZone({ accept, label, hint, onFile, selectedName }) {
  const inputId = `upload-${Math.random().toString(36).slice(2)}`;
 
  return (
    <div>
      <label
        htmlFor={inputId}
        style={{
          border: '1px dashed #ccc',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          display: 'block',
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📄</div>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>{label}</p>
        <span style={{ fontSize: '11px', color: '#999' }}>{hint}</span>
        <input
          id={inputId}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => onFile(e.target.files[0])}
        />
      </label>
      {selectedName && (
        <p style={{ fontSize: '12px', color: '#0F6E56', marginTop: '8px', fontWeight: '500' }}>
          ✓ {selectedName}
        </p>
      )}
    </div>
  );
}
 
// ─── BTN ─────────────────────────────────────────────────────
// Botón reutilizable con color de acento configurable.
 
export function Btn({ children, onClick, color = '#185FA5', disabled = false, fullWidth = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 14px',
        background: disabled ? '#e5e5e5' : color,
        color: disabled ? '#999' : '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        justifyContent: fullWidth ? 'center' : 'flex-start',
      }}
    >
      {children}
    </button>
  );
}
 