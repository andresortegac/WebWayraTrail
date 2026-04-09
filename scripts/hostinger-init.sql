CREATE TABLE IF NOT EXISTS inscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  edad INT NOT NULL,
  genero ENUM('M', 'F') NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  color_categoria VARCHAR(20) NOT NULL,
  talla_camiseta VARCHAR(10) NOT NULL,
  contacto_emergencia VARCHAR(100) NOT NULL,
  telefono_emergencia VARCHAR(20) NOT NULL,
  fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria),
  INDEX idx_genero (genero)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
  content_key VARCHAR(100) PRIMARY KEY,
  content_json LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (name, username, email, password_hash, role)
VALUES (
  'Administrador WAYRA TRAIL',
  'admin',
  'admin@wayratrail.com',
  '$2b$10$Oh5x0z5y2cg7hOZdHVXfz.YAxhTSPSFdhZwvr/IOdUHgpGqHn2.G.',
  'admin'
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  email = VALUES(email),
  password_hash = VALUES(password_hash),
  role = VALUES(role);
