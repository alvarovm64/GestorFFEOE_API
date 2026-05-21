const API_URL = 'https://gestorffeoeapi-production.up.railway.app';
 
// Recupera el token JWT que guardamos al hacer login
function getToken() {
  return localStorage.getItem('token');
}
 
// Construye las cabeceras de cada petición.
// Si "multipart" es true, no ponemos Content-Type porque el
// navegador lo gestiona solo al enviar FormData (ficheros).
function buildHeaders(multipart = false) {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
  };
  if (!multipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}
 
// Función base que lanza la petición y gestiona errores
async function request(method, endpoint, body = null, multipart = false) {
  const options = {
    method,
    headers: buildHeaders(multipart),
  };
 
  if (body) {
    options.body = multipart ? body : JSON.stringify(body);
  }
 
  const res = await fetch(`${API_URL}${endpoint}`, options);
 
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }
 
  // Algunos endpoints devuelven vacío al borrar
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
 
// ─── AUTH ────────────────────────────────────────────────────
 
export const login = (email, password) =>
  request('POST', '/api/auth/login', { email, password });
 
// ─── ADMIN: CICLOS ───────────────────────────────────────────
 
export const getCiclos = () =>
  request('GET', '/api/admin/ciclos');
 
export const createCiclo = (nombre, año_inicio, año_fin) =>
  request('POST', '/api/admin/ciclos', { nombre, año_inicio, año_fin });
 
export const deleteCiclo = (id) =>
  request('DELETE', `/api/admin/ciclos/${id}`);
 
// ─── ADMIN: PROFESORES ───────────────────────────────────────
 
export const getProfesores = () =>
  request('GET', '/api/profesores/');
 
export const createProfesor = (usuario_id, ciclo_id) =>
  request('POST', '/api/profesores/', { usuario_id, ciclo_id });
 
export const deleteProfesor = (id) =>
  request('DELETE', `/api/profesores/${id}`);
 
// ─── EMPRESAS ────────────────────────────────────────────────
 
export const getEmpresas = () =>
  request('GET', '/api/empresas/');
 
export const createEmpresa = (data) =>
  request('POST', '/api/empresas/', data);
 
// ─── CONTACTOS ───────────────────────────────────────────────
 
export const getContactos = () =>
  request('GET', '/api/empresas/contactos');
 
export const createContacto = (data) =>
  request('POST', '/api/empresas/contactos', data);
 
// ─── PLAZAS ──────────────────────────────────────────────────
 
export const getPlazas = () =>
  request('GET', '/api/alumnos/plazas');
 
export const createPlaza = (empresa_id, ciclo_id, total_plazas) =>
  request('POST', '/api/alumnos/plazas', { empresa_id, ciclo_id, total_plazas });
 
// ─── ASIGNACIONES ────────────────────────────────────────────
 
export const getAsignaciones = () =>
  request('GET', '/api/alumnos/asignaciones');
 
export const createAsignacion = (alumno_id, plaza_id, tutor_laboral_id = null) =>
  request('POST', '/api/alumnos/asignaciones', { alumno_id, plaza_id, tutor_laboral_id });
 
// ─── ALUMNO ──────────────────────────────────────────────────
 
export const getDashboardAlumno = (alumno_id) =>
  request('GET', `/api/alumnos/${alumno_id}/dashboard`);
 
export const subirCV = (alumno_id, archivo) => {
  const form = new FormData();
  form.append('archivo', archivo);
  return request('POST', `/api/alumnos/${alumno_id}/cv`, form, true);
};
 
// ─── IMPORTAR CSV ────────────────────────────────────────────
 
export const importarAlumnos = (ciclo_id, archivo) => {
  const form = new FormData();
  form.append('archivo', archivo);
  return request('POST', `/api/profesores/importar-alumnos?ciclo_id=${ciclo_id}`, form, true);
};
 
export const importarEmpresas = (archivo) => {
  const form = new FormData();
  form.append('archivo', archivo);
  return request('POST', '/api/profesores/importar-empresas', form, true);
};