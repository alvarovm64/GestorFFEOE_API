import { useState, useEffect } from 'react';
import { Sidebar, Card, Alert, useAlert, Btn, UploadZone } from '.';
import {
  getEmpresas, createEmpresa,
  getContactos, createContacto,
  getPlazas, createPlaza,
  createAsignacion,
  importarAlumnos, importarEmpresas,
  getCiclos, getProfesores,
} from '../api/client';

const NAV_ITEMS = [
  { id: 'empresas',     label: 'Empresas',      icon: '🏢' },
  { id: 'importar',    label: 'Importar CSV',   icon: '📤' },
  { id: 'contactos',   label: 'Contactos',      icon: '📞' },
  { id: 'plazas',      label: 'Plazas',         icon: '🪑' },
  { id: 'asignaciones',label: 'Asignaciones',   icon: '🔀' },
];

export default function ProfesorPanel({ onLogout }) {
  const [section, setSection] = useState('empresas');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        color="#0F6E56"
        icon="🏫"
        rol="Profesor"
        items={NAV_ITEMS}
        active={section}
        onChange={setSection}
        onLogout={onLogout}
      />
      <main style={{ flex: 1, padding: '1.75rem 1.5rem', background: '#f5f5f4' }}>
        {section === 'empresas'      && <SeccionEmpresas />}
        {section === 'importar'      && <SeccionImportar />}
        {section === 'contactos'     && <SeccionContactos />}
        {section === 'plazas'        && <SeccionPlazas />}
        {section === 'asignaciones'  && <SeccionAsignaciones />}
      </main>
    </div>
  );
}

// ─── SECCIÓN EMPRESAS ────────────────────────────────────────

function SeccionEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', web: '', persona_contacto: '', direccion: '' });
  const [alertMsg, alertType, showAlert] = useAlert();

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    try { setEmpresas(await getEmpresas()); }
    catch { showAlert('No se pudieron cargar las empresas', 'error'); }
  }

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleCrear() {
    if (!form.nombre) { showAlert('El nombre es obligatorio', 'error'); return; }
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v || null])
      );
      await createEmpresa(payload);
      showAlert('Empresa creada correctamente', 'success');
      setForm({ nombre: '', email: '', telefono: '', web: '', persona_contacto: '', direccion: '' });
      cargar();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  }

  return (
    <>
      <PageHeader title="Empresas" subtitle="Consulta y registra empresas colaboradoras" />
      <Alert msg={alertMsg} type={alertType} />
      <Card title="Nueva empresa">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { key: 'nombre', label: 'Nombre *', placeholder: 'Empresa S.L.' },
            { key: 'email', label: 'Email', placeholder: 'info@empresa.com', type: 'email' },
            { key: 'telefono', label: 'Teléfono', placeholder: '958000000' },
            { key: 'web', label: 'Web', placeholder: 'www.empresa.com' },
            { key: 'persona_contacto', label: 'Persona de contacto', placeholder: 'Nombre Apellido' },
            { key: 'direccion', label: 'Dirección', placeholder: 'Calle, nº, ciudad' },
          ].map(f => (
            <Field key={f.key} label={f.label}>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={e => setField(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={inputStyle}
              />
            </Field>
          ))}
        </div>
        <div style={{ marginTop: '10px' }}>
          <Btn onClick={handleCrear} color="#0F6E56">+ Añadir empresa</Btn>
        </div>
      </Card>
      <Card title="Empresas registradas" headerAction={<Btn onClick={cargar} color="#0F6E56">↺ Actualizar</Btn>}>
        {empresas.length === 0
          ? <p style={emptyStyle}>No hay empresas todavía</p>
          : (
            <table style={tableStyle}>
              <thead>
                <tr>{['Nombre', 'Email', 'Teléfono', 'Contacto'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {empresas.map(e => (
                  <tr key={e.id}>
                    <td style={tdStyle}>{e.nombre}</td>
                    <td style={tdStyle}>{e.email || '—'}</td>
                    <td style={tdStyle}>{e.telefono || '—'}</td>
                    <td style={tdStyle}>{e.persona_contacto || '—'}</td>
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

// ─── SECCIÓN IMPORTAR CSV ────────────────────────────────────

function SeccionImportar() {
  const [ciclos, setCiclos] = useState([]);
  const [cicloId, setCicloId] = useState('');
  const [archivoAlumnos, setArchivoAlumnos] = useState(null);
  const [archivoEmpresas, setArchivoEmpresas] = useState(null);
  const [alertMsg, alertType, showAlert] = useAlert();

  useEffect(() => {
    getCiclos().then(setCiclos).catch(() => showAlert('No se pudieron cargar los ciclos', 'error'));
  }, []);

  async function handleImportarAlumnos() {
    if (!cicloId || !archivoAlumnos) { showAlert('Selecciona un ciclo y un fichero CSV', 'error'); return; }
    try {
      await importarAlumnos(cicloId, archivoAlumnos);
      showAlert('Alumnos importados correctamente', 'success');
      setArchivoAlumnos(null);
    } catch (err) { showAlert(err.message, 'error'); }
  }

  async function handleImportarEmpresas() {
    if (!archivoEmpresas) { showAlert('Selecciona un fichero CSV', 'error'); return; }
    try {
      await importarEmpresas(archivoEmpresas);
      showAlert('Empresas importadas correctamente', 'success');
      setArchivoEmpresas(null);
    } catch (err) { showAlert(err.message, 'error'); }
  }

  return (
    <>
      <PageHeader title="Importar CSV" subtitle="Sube ficheros para cargar alumnos o empresas de golpe" />
      <Alert msg={alertMsg} type={alertType} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Card title="Importar alumnos">
          <Field label="Ciclo">
            <select value={cicloId} onChange={e => setCicloId(e.target.value)} style={inputStyle}>
              <option value="">Selecciona un ciclo...</option>
              {ciclos.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.anio_inicio}–{c.anio_fin})</option>
              ))}
            </select>
          </Field>
          <UploadZone
            accept=".csv"
            label="Haz clic para seleccionar el CSV"
            hint="Formato: nombre, email, password"
            onFile={setArchivoAlumnos}
            selectedName={archivoAlumnos?.name}
          />
          <div style={{ marginTop: '12px' }}>
            <Btn onClick={handleImportarAlumnos} color="#0F6E56" fullWidth>📤 Subir alumnos</Btn>
          </div>
        </Card>
        <Card title="Importar empresas">
          <UploadZone
            accept=".csv"
            label="Haz clic para seleccionar el CSV"
            hint="Formato: nombre, email, web..."
            onFile={setArchivoEmpresas}
            selectedName={archivoEmpresas?.name}
          />
          <div style={{ marginTop: '12px' }}>
            <Btn onClick={handleImportarEmpresas} color="#0F6E56" fullWidth>📤 Subir empresas</Btn>
          </div>
        </Card>
      </div>
    </>
  );
}

// ─── SECCIÓN CONTACTOS ───────────────────────────────────────

function SeccionContactos() {
  const [contactos, setContactos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [form, setForm] = useState({ profesor_id: '', empresa_id: '', fecha_hora: '', notas: '' });
  const [alertMsg, alertType, showAlert] = useAlert();

  useEffect(() => {
    cargar();
    getEmpresas().then(setEmpresas).catch(() => {});
    getProfesores().then(setProfesores).catch(() => {});
  }, []);

  async function cargar() {
    try { setContactos(await getContactos()); }
    catch { showAlert('No se pudieron cargar los contactos', 'error'); }
  }

  async function handleCrear() {
    const { profesor_id, empresa_id, fecha_hora } = form;
    if (!profesor_id || !empresa_id || !fecha_hora) { showAlert('Rellena los campos obligatorios', 'error'); return; }
    try {
      await createContacto({
        profesor_id: parseInt(profesor_id),
        empresa_id: parseInt(empresa_id),
        fecha_hora,
        notas: form.notas || null,
      });
      showAlert('Contacto registrado', 'success');
      setForm({ profesor_id: '', empresa_id: '', fecha_hora: '', notas: '' });
      cargar();
    } catch (err) { showAlert(err.message, 'error'); }
  }

  const nombreProfesor = (id) => {
    const p = profesores.find(p => p.id === id);
    return p ? `Profesor #${p.id}` : `#${id}`;
  };

  const nombreEmpresa = (id) => {
    const e = empresas.find(e => e.id === id);
    return e ? e.nombre : `#${id}`;
  };

  return (
    <>
      <PageHeader title="Contactos con empresas" subtitle="Registra cuándo has contactado con cada empresa" />
      <Alert msg={alertMsg} type={alertType} />
      <Card title="Registrar contacto">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <Field label="Profesor">
            <select value={form.profesor_id} onChange={e => setForm(p => ({ ...p, profesor_id: e.target.value }))} style={inputStyle}>
              <option value="">Selecciona profesor...</option>
              {profesores.map(p => (
                <option key={p.id} value={p.id}>Profesor #{p.id}</option>
              ))}
            </select>
          </Field>
          <Field label="Empresa">
            <select value={form.empresa_id} onChange={e => setForm(p => ({ ...p, empresa_id: e.target.value }))} style={inputStyle}>
              <option value="">Selecciona empresa...</option>
              {empresas.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </Field>
          <Field label="Fecha y hora">
            <input type="datetime-local" value={form.fecha_hora} onChange={e => setForm(p => ({ ...p, fecha_hora: e.target.value }))} style={inputStyle} />
          </Field>
        </div>
        <Field label="Notas">
          <textarea
            value={form.notas}
            onChange={e => setForm(p => ({ ...p, notas: e.target.value }))}
            placeholder="Ej: Han confirmado 2 plazas para DAW..."
            rows={2}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Field>
        <Btn onClick={handleCrear} color="#0F6E56">+ Registrar</Btn>
      </Card>
      <Card title="Historial de contactos" headerAction={<Btn onClick={cargar} color="#0F6E56">↺ Actualizar</Btn>}>
        {contactos.length === 0
          ? <p style={emptyStyle}>No hay contactos registrados</p>
          : (
            <table style={tableStyle}>
              <thead>
                <tr>{['Profesor', 'Empresa', 'Fecha y hora', 'Notas'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {contactos.map(c => (
                  <tr key={c.id}>
                    <td style={tdStyle}>{nombreProfesor(c.profesor_id)}</td>
                    <td style={tdStyle}>{nombreEmpresa(c.empresa_id)}</td>
                    <td style={tdStyle}>{new Date(c.fecha_hora).toLocaleString('es-ES')}</td>
                    <td style={{ ...tdStyle, color: '#888' }}>{c.notas || '—'}</td>
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

// ─── SECCIÓN PLAZAS ──────────────────────────────────────────

function SeccionPlazas() {
  const [plazas, setPlazas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [form, setForm] = useState({ empresa_id: '', ciclo_id: '', total_plazas: '' });
  const [alertMsg, alertType, showAlert] = useAlert();

  useEffect(() => {
    cargar();
    getEmpresas().then(setEmpresas).catch(() => {});
    getCiclos().then(setCiclos).catch(() => {});
  }, []);

  async function cargar() {
    try { setPlazas(await getPlazas()); }
    catch { showAlert('No se pudieron cargar las plazas', 'error'); }
  }

  async function handleCrear() {
    const { empresa_id, ciclo_id, total_plazas } = form;
    if (!empresa_id || !ciclo_id || !total_plazas) { showAlert('Rellena todos los campos', 'error'); return; }
    try {
      await createPlaza(parseInt(empresa_id), parseInt(ciclo_id), parseInt(total_plazas));
      showAlert('Plaza creada correctamente', 'success');
      setForm({ empresa_id: '', ciclo_id: '', total_plazas: '' });
      cargar();
    } catch (err) { showAlert(err.message, 'error'); }
  }

  const nombreEmpresa = (id) => {
    const e = empresas.find(e => e.id === id);
    return e ? e.nombre : `#${id}`;
  };

  const nombreCiclo = (id) => {
    const c = ciclos.find(c => c.id === id);
    return c ? c.nombre : `#${id}`;
  };

  return (
    <>
      <PageHeader title="Plazas" subtitle="Define cuántos alumnos acepta cada empresa por ciclo" />
      <Alert msg={alertMsg} type={alertType} />
      <Card title="Nueva plaza">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
          <Field label="Empresa">
            <select value={form.empresa_id} onChange={e => setForm(p => ({ ...p, empresa_id: e.target.value }))} style={inputStyle}>
              <option value="">Selecciona empresa...</option>
              {empresas.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </Field>
          <Field label="Ciclo">
            <select value={form.ciclo_id} onChange={e => setForm(p => ({ ...p, ciclo_id: e.target.value }))} style={inputStyle}>
              <option value="">Selecciona ciclo...</option>
              {ciclos.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.anio_inicio}–{c.anio_fin})</option>
              ))}
            </select>
          </Field>
          <Field label="Total plazas">
            <input type="number" value={form.total_plazas} onChange={e => setForm(p => ({ ...p, total_plazas: e.target.value }))} placeholder="2" style={inputStyle} />
          </Field>
          <Btn onClick={handleCrear} color="#0F6E56">+ Añadir</Btn>
        </div>
      </Card>
      <Card title="Plazas registradas" headerAction={<Btn onClick={cargar} color="#0F6E56">↺ Actualizar</Btn>}>
        {plazas.length === 0
          ? <p style={emptyStyle}>No hay plazas registradas</p>
          : (
            <table style={tableStyle}>
              <thead>
                <tr>{['ID', 'Empresa', 'Ciclo', 'Total', 'Ocupadas', 'Libres'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {plazas.map(p => {
                  const libres = p.total_plazas - p.plazas_ocupadas;
                  return (
                    <tr key={p.id}>
                      <td style={tdStyle}>#{p.id}</td>
                      <td style={tdStyle}>{nombreEmpresa(p.empresa_id)}</td>
                      <td style={tdStyle}>{nombreCiclo(p.ciclo_id)}</td>
                      <td style={tdStyle}>{p.total_plazas}</td>
                      <td style={tdStyle}>{p.plazas_ocupadas}</td>
                      <td style={tdStyle}>
                        <span style={{ background: libres > 0 ? '#EAF3DE' : '#FAEEDA', color: libres > 0 ? '#27500A' : '#633806', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '500' }}>
                          {libres}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        }
      </Card>
    </>
  );
}

// ─── SECCIÓN ASIGNACIONES ────────────────────────────────────

function SeccionAsignaciones() {
  const [plazas, setPlazas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [form, setForm] = useState({ alumno_id: '', plaza_id: '' });
  const [alertMsg, alertType, showAlert] = useAlert();

  useEffect(() => {
    getPlazas().then(setPlazas).catch(() => {});
    getEmpresas().then(setEmpresas).catch(() => {});
    getCiclos().then(setCiclos).catch(() => {});
  }, []);

  async function handleAsignar() {
    const { alumno_id, plaza_id } = form;
    if (!alumno_id || !plaza_id) { showAlert('Alumno y plaza son obligatorios', 'error'); return; }
    try {
      await createAsignacion(parseInt(alumno_id), parseInt(plaza_id), null);
      showAlert('Alumno asignado correctamente', 'success');
      setForm({ alumno_id: '', plaza_id: '' });
    } catch (err) {
      showAlert('Error al asignar. ¿Quedan plazas libres?', 'error');
    }
  }

  const nombreEmpresa = (id) => {
    const e = empresas.find(e => e.id === id);
    return e ? e.nombre : `#${id}`;
  };

  const nombreCiclo = (id) => {
    const c = ciclos.find(c => c.id === id);
    return c ? c.nombre : `#${id}`;
  };

  return (
    <>
      <PageHeader title="Asignaciones" subtitle="Asocia alumnos a plazas de empresa" />
      <Alert msg={alertMsg} type={alertType} />
      <Card title="Asignar alumno a plaza">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
          <Field label="ID Alumno">
            <input type="number" value={form.alumno_id} onChange={e => setForm(p => ({ ...p, alumno_id: e.target.value }))} placeholder="1" style={inputStyle} />
          </Field>
          <Field label="Plaza">
            <select value={form.plaza_id} onChange={e => setForm(p => ({ ...p, plaza_id: e.target.value }))} style={inputStyle}>
              <option value="">Selecciona plaza...</option>
              {plazas.filter(p => p.total_plazas - p.plazas_ocupadas > 0).map(p => (
                <option key={p.id} value={p.id}>
                  {nombreEmpresa(p.empresa_id)} — {nombreCiclo(p.ciclo_id)} ({p.total_plazas - p.plazas_ocupadas} libres)
                </option>
              ))}
            </select>
          </Field>
          <Btn onClick={handleAsignar} color="#0F6E56">✓ Asignar</Btn>
        </div>
      </Card>
    </>
  );
}

// ─── HELPERS LOCALES ─────────────────────────────────────────

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h1 style={{ fontSize: '18px', fontWeight: '500' }}>{title}</h1>
      <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>{subtitle}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '7px 10px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle    = { fontSize: '12px', fontWeight: '500', color: '#888', textAlign: 'left', padding: '8px 0', borderBottom: '1px solid #e5e5e5' };
const tdStyle    = { fontSize: '13px', padding: '10px 0', borderBottom: '1px solid #f0f0f0' };
const emptyStyle = { textAlign: 'center', padding: '2rem', color: '#aaa', fontSize: '13px' };