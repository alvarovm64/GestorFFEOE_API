// ─────────────────────────────────────────────────────────────
//  AlumnoPanel.jsx  –  Panel del alumno
//
//  Secciones:
//    · Dashboard → ver estado de asignación (pendiente / asignado)
//    · Mi CV     → subir currículum en PDF
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Sidebar, Card, Alert, useAlert, Btn, UploadZone } from '../components';
import { getDashboardAlumno, subirCV } from '../api/client';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'cv',        label: 'Mi CV',     icon: '📄' },
];

export default function AlumnoPanel({ onLogout }) {
  const [section, setSection] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        color="#533AB7"
        icon="🎓"
        rol="Alumno"
        items={NAV_ITEMS}
        active={section}
        onChange={setSection}
        onLogout={onLogout}
      />
      <main style={{ flex: 1, padding: '1.75rem 1.5rem', background: '#f5f5f4' }}>
        {section === 'dashboard' && <SeccionDashboard />}
        {section === 'cv'        && <SeccionCV />}
      </main>
    </div>
  );
}

// ─── SECCIÓN DASHBOARD ───────────────────────────────────────

function SeccionDashboard() {
  const [alumnoId, setAlumnoId]     = useState('');
  const [resultado, setResultado]   = useState(null);
  const [alertMsg, alertType, showAlert] = useAlert();

  async function handleConsultar() {
    if (!alumnoId) { showAlert('Introduce tu ID de alumno', 'error'); return; }
    try {
      const data = await getDashboardAlumno(alumnoId);
      setResultado(data);
    } catch {
      showAlert('No se pudo cargar el dashboard. Comprueba el ID.', 'error');
      setResultado(null);
    }
  }

  // Determinamos si está asignado o pendiente
  const asignacion = resultado?.asignacion;
  const estaAsignado = asignacion && asignacion.estado !== 'pendiente';

  return (
    <>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '500' }}>Mi estado de prácticas</h1>
        <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Aquí puedes ver en qué punto está tu asignación</p>
      </div>

      <Alert msg={alertMsg} type={alertType} />

      <Card title="Consultar mi asignación">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Tu ID de alumno</label>
            <input
              type="number"
              value={alumnoId}
              onChange={e => setAlumnoId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConsultar()}
              placeholder="Ej: 1"
              style={inputStyle}
            />
          </div>
          <Btn onClick={handleConsultar} color="#533AB7">🔍 Consultar</Btn>
        </div>
      </Card>

      {resultado && (
        <>
          {/* Banner de estado: verde si asignado, ámbar si pendiente */}
          <div style={{
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
            border: `1px solid ${estaAsignado ? '#C0DD97' : '#FAC775'}`,
            background: estaAsignado ? '#EAF3DE' : '#FAEEDA',
          }}>
            <span style={{ fontSize: '32px' }}>{estaAsignado ? '✅' : '⏳'}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', color: estaAsignado ? '#27500A' : '#633806', marginBottom: '4px' }}>
                Estado actual
              </div>
              <div style={{ fontSize: '18px', fontWeight: '500' }}>
                {estaAsignado ? (resultado.empresa?.nombre || 'Empresa asignada') : 'Pendiente de asignación'}
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {estaAsignado
                  ? 'Ya tienes empresa asignada para tus prácticas'
                  : 'Tu profesor todavía no te ha asignado a ninguna empresa'}
              </div>
            </div>
          </div>

          {/* Detalles de la asignación */}
          <Card title="Detalles">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'ID de asignación', value: asignacion?.id ?? '—' },
                { label: 'Plaza',            value: asignacion?.plaza_id ?? '—' },
                { label: 'Tutor laboral',    value: asignacion?.tutor_laboral_id ?? 'Sin tutor asignado' },
                { label: 'Estado',           value: asignacion?.estado ?? 'Pendiente' },
              ].map(item => (
                <div key={item.label} style={{ background: '#f5f5f4', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </>
  );
}

// ─── SECCIÓN CV ──────────────────────────────────────────────

function SeccionCV() {
  const [alumnoId, setAlumnoId]   = useState('');
  const [archivo, setArchivo]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [alertMsg, alertType, showAlert] = useAlert();

  async function handleSubir() {
    if (!alumnoId) { showAlert('Introduce tu ID de alumno', 'error'); return; }
    if (!archivo)  { showAlert('Selecciona un fichero PDF', 'error'); return; }

    setLoading(true);
    try {
      await subirCV(alumnoId, archivo);
      showAlert('CV subido correctamente', 'success');
      setArchivo(null);
    } catch (err) {
      showAlert(err.message || 'Error al subir el CV', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '500' }}>Mi currículum</h1>
        <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Sube tu CV en PDF para que los profesores puedan consultarlo</p>
      </div>

      <Alert msg={alertMsg} type={alertType} />

      <Card title="Subir CV">
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Tu ID de alumno</label>
          <input
            type="number"
            value={alumnoId}
            onChange={e => setAlumnoId(e.target.value)}
            placeholder="Ej: 1"
            style={{ ...inputStyle, maxWidth: '200px' }}
          />
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '1rem 0' }} />
        <UploadZone
          accept=".pdf"
          label="Haz clic para seleccionar tu CV"
          hint="Solo ficheros PDF"
          onFile={setArchivo}
          selectedName={archivo?.name}
        />
        <div style={{ marginTop: '1rem' }}>
          <Btn onClick={handleSubir} color="#533AB7" disabled={loading} fullWidth>
            {loading ? 'Subiendo...' : '📤 Subir CV'}
          </Btn>
        </div>
      </Card>

      <Card title="Consejos para tu CV">
        <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
          {[
            'Incluye tus proyectos del ciclo con una breve descripción',
            'Añade el enlace a tu GitHub si tienes proyectos subidos',
            'Máximo 2 páginas — las empresas no leen más',
            'Guárdalo con tu nombre: NombreApellido_CV.pdf',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
              <span style={{ color: '#3B6D11' }}>✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

const inputStyle = { width: '100%', padding: '7px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' };