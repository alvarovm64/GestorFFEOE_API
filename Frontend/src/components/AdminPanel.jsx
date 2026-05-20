// ─────────────────────────────────────────────────────────────
//  AdminPanel.jsx  –  Panel del administrador
//
//  Secciones:
//    · Ciclos    → listar, crear, borrar
//    · Profesores → listar, crear, borrar
// ─────────────────────────────────────────────────────────────
 
import { useState, useEffect } from 'react';
import { Sidebar, Card, Alert, useAlert, Btn } from '../components';
import {
  getCiclos, createCiclo, deleteCiclo,
  getProfesores, createProfesor, deleteProfesor,
} from '../api/client';
 
const NAV_ITEMS = [
  { id: 'ciclos',     label: 'Ciclos',     icon: '📚' },
  { id: 'profesores', label: 'Profesores', icon: '👥' },
];
 
export default function AdminPanel({ onLogout }) {
  const [section, setSection] = useState('ciclos');
 
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        color="#185FA5"
        icon="🏭"
        rol="Administrador"
        items={NAV_ITEMS}
        active={section}
        onChange={setSection}
        onLogout={onLogout}
      />
      <main style={{ flex: 1, padding: '1.75rem 1.5rem', background: '#f5f5f4' }}>
        {section === 'ciclos'     && <SeccionCiclos />}
        {section === 'profesores' && <SeccionProfesores />}
      </main>
    </div>
  );
}
 
// ─── SECCIÓN CICLOS ──────────────────────────────────────────
 
function SeccionCiclos() {
  const [ciclos, setCiclos]   = useState([]);
  const [nombre, setNombre]   = useState('');
  const [inicio, setInicio]   = useState('');
  const [fin, setFin]         = useState('');
  const [alertMsg, alertType, showAlert] = useAlert();
 
  // useEffect con array vacío [] = se ejecuta una sola vez al montar el componente
  useEffect(() => { cargar(); }, []);
 
  async function cargar() {
    try {
      const data = await getCiclos();
      setCiclos(data);
    } catch {
      showAlert('No se pudieron cargar los ciclos', 'error');
    }
  }
 
  async function handleCrear() {
    if (!nombre || !inicio || !fin) {
      showAlert('Rellena todos los campos', 'error');
      return;
    }
    try {
      await createCiclo(nombre, parseInt(inicio), parseInt(fin));
      showAlert('Ciclo creado correctamente', 'success');
      setNombre(''); setInicio(''); setFin('');
      cargar();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  }
 
  async function handleBorrar(id) {
    if (!window.confirm('¿Seguro que quieres borrar este ciclo?')) return;
    try {
      await deleteCiclo(id);
      showAlert('Ciclo eliminado', 'success');
      cargar();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  }
 
  return (
    <>
      <div style={headerStyle}>
        <h1 style={h1Style}>Ciclos formativos</h1>
        <p style={subtitleStyle}>Crea y gestiona los ciclos del centro</p>
      </div>
 
      <Alert msg={alertMsg} type={alertType} />
 
      <Card title="Nuevo ciclo">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
          <Field label="Nombre">
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="DAW" style={inputStyle} />
          </Field>
          <Field label="Año inicio">
            <input type="number" value={inicio} onChange={e => setInicio(e.target.value)} placeholder="2024" style={inputStyle} />
          </Field>
          <Field label="Año fin">
            <input type="number" value={fin} onChange={e => setFin(e.target.value)} placeholder="2026" style={inputStyle} />
          </Field>
          <Btn onClick={handleCrear} color="#185FA5">+ Añadir</Btn>
        </div>
      </Card>
 
      <Card title="Ciclos registrados" headerAction={<Btn onClick={cargar} color="#185FA5">↺ Actualizar</Btn>}>
        {ciclos.length === 0
          ? <p style={emptyStyle}>No hay ciclos todavía</p>
          : (
            <table style={tableStyle}>
              <thead>
                <tr>{['ID', 'Nombre', 'Inicio', 'Fin', ''].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {ciclos.map(c => (
                  <tr key={c.id}>
                    <td style={tdStyle}><Badge color="blue">#{c.id}</Badge></td>
                    <td style={tdStyle}>{c.nombre}</td>
                    <td style={tdStyle}>{c.anio_inicio}</td>
                    <td style={tdStyle}>{c.anio_fin}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleBorrar(c.id)} style={deleteBtnStyle}>🗑 Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </Card>
    </>
  );
}
 
// ─── SECCIÓN PROFESORES ──────────────────────────────────────
 
function SeccionProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [usuarioId, setUsuarioId]   = useState('');
  const [cicloId, setCicloId]       = useState('');
  const [alertMsg, alertType, showAlert] = useAlert();
 
  useEffect(() => { cargar(); }, []);
 
  async function cargar() {
    try {
      const data = await getProfesores();
      setProfesores(data);
    } catch {
      showAlert('No se pudieron cargar los profesores', 'error');
    }
  }
 
  async function handleCrear() {
    if (!usuarioId || !cicloId) { showAlert('Rellena todos los campos', 'error'); return; }
    try {
      await createProfesor(parseInt(usuarioId), parseInt(cicloId));
      showAlert('Profesor creado correctamente', 'success');
      setUsuarioId(''); setCicloId('');
      cargar();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  }
 
  async function handleBorrar(id) {
    if (!window.confirm('¿Seguro?')) return;
    try {
      await deleteProfesor(id);
      showAlert('Profesor eliminado', 'success');
      cargar();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  }
 
  return (
    <>
      <div style={headerStyle}>
        <h1 style={h1Style}>Profesores</h1>
        <p style={subtitleStyle}>Asigna profesores a ciclos</p>
      </div>
 
      <Alert msg={alertMsg} type={alertType} />
 
      <Card title="Nuevo profesor">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
          <Field label="ID de usuario">
            <input type="number" value={usuarioId} onChange={e => setUsuarioId(e.target.value)} placeholder="3" style={inputStyle} />
          </Field>
          <Field label="ID de ciclo">
            <input type="number" value={cicloId} onChange={e => setCicloId(e.target.value)} placeholder="1" style={inputStyle} />
          </Field>
          <Btn onClick={handleCrear} color="#185FA5">+ Añadir</Btn>
        </div>
      </Card>
 
      <Card title="Profesores registrados" headerAction={<Btn onClick={cargar} color="#185FA5">↺ Actualizar</Btn>}>
        {profesores.length === 0
          ? <p style={emptyStyle}>No hay profesores todavía</p>
          : (
            <table style={tableStyle}>
              <thead>
                <tr>{['ID', 'ID Usuario', 'ID Ciclo', ''].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {profesores.map(p => (
                  <tr key={p.id}>
                    <td style={tdStyle}><Badge color="blue">#{p.id}</Badge></td>
                    <td style={tdStyle}>{p.usuario_id}</td>
                    <td style={tdStyle}>{p.ciclo_id}</td>
                    <td style={tdStyle}>
                      <button onClick={() => handleBorrar(p.id)} style={deleteBtnStyle}>🗑 Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </Card>
    </>
  );
}
 
// ─── HELPERS LOCALES ─────────────────────────────────────────
 
function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>{label}</label>
      {children}
    </div>
  );
}
 
function Badge({ children, color }) {
  const colors = {
    blue: { bg: '#E6F1FB', text: '#0C447C' },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ background: c.bg, color: c.text, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '500' }}>
      {children}
    </span>
  );
}
 
// Estilos compartidos dentro de este archivo
const headerStyle  = { marginBottom: '1.25rem' };
const h1Style      = { fontSize: '18px', fontWeight: '500' };
const subtitleStyle = { fontSize: '13px', color: '#888', marginTop: '2px' };
const inputStyle   = { width: '100%', padding: '7px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' };
const tableStyle   = { width: '100%', borderCollapse: 'collapse' };
const thStyle      = { fontSize: '12px', fontWeight: '500', color: '#888', textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #e5e5e5' };
const tdStyle      = { fontSize: '13px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' };
const emptyStyle   = { textAlign: 'center', padding: '2rem', color: '#aaa', fontSize: '13px' };
const deleteBtnStyle = { padding: '5px 10px', background: 'transparent', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' };