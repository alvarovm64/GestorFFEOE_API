CREATE DATABASE IF NOT EXISTS gestor_practicas;
USE gestor_practicas;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'profesor', 'alumno') NOT NULL
);

CREATE TABLE ciclos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    anio_inicio YEAR NOT NULL,
    anio_fin YEAR NOT NULL
);

CREATE TABLE profesores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ciclo_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (ciclo_id) REFERENCES ciclos(id) ON DELETE CASCADE
);

CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ciclo_id INT NOT NULL,
    cv_pdf_path VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (ciclo_id) REFERENCES ciclos(id) ON DELETE CASCADE
);

CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    web VARCHAR(150),
    email VARCHAR(150),
    telefono VARCHAR(20),
    persona_contacto VARCHAR(100)
);

CREATE TABLE responsables_legales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    dni VARCHAR(20) NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

CREATE TABLE tutores_laborales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    dni VARCHAR(20) NOT NULL,
    telefono VARCHAR(20),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

CREATE TABLE plazas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    ciclo_id INT NOT NULL,
    total_plazas INT NOT NULL,
    plazas_ocupadas INT DEFAULT 0,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (ciclo_id) REFERENCES ciclos(id) ON DELETE CASCADE
);

CREATE TABLE asignaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    plaza_id INT NOT NULL,
    tutor_laboral_id INT,
    estado ENUM('pendiente', 'aceptada', 'rechazada', 'finalizada'),
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (plaza_id) REFERENCES plazas(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_laboral_id) REFERENCES tutores_laborales(id) ON DELETE SET NULL
);

CREATE TABLE contactos_empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profesor_id INT NOT NULL,
    empresa_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    notas TEXT,
    FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);

CREATE TABLE periodos_asignacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
);

CREATE INDEX idx_usuario_email ON usuarios(email);

ALTER TABLE plazas
ADD CONSTRAINT chk_plazas CHECK (plazas_ocupadas <= total_plazas);