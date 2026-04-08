const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Calculate category based on age
function calculateCategory(edad) {
  if (edad >= 18 && edad <= 39) {
    return { categoria: 'Libre', color: '#FCD34D' }; // Amarillo
  } else if (edad >= 40 && edad <= 49) {
    return { categoria: 'A', color: '#10B981' }; // Verde
  } else if (edad >= 50 && edad <= 59) {
    return { categoria: 'B', color: '#3B82F6' }; // Azul
  } else if (edad >= 60) {
    return { categoria: 'C', color: '#8B5CF6' }; // Morado
  }
  return { categoria: 'Recreativa', color: '#EF4444' }; // Rojo - para menores de 18
}

// Create new inscription (public)
router.post('/', async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      cedula,
      email,
      telefono,
      fecha_nacimiento,
      genero,
      talla_camiseta,
      contacto_emergencia,
      telefono_emergencia,
      es_recreativa
    } = req.body;

    // Validate required fields
    if (!nombres || !apellidos || !cedula || !email || !telefono || 
        !fecha_nacimiento || !genero || !talla_camiseta || 
        !contacto_emergencia || !telefono_emergencia) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate age
    const birthDate = new Date(fecha_nacimiento);
    const today = new Date();
    let edad = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      edad--;
    }

    // Determine category
    let categoriaInfo;
    if (es_recreativa) {
      categoriaInfo = { categoria: 'Recreativa', color: '#EF4444' }; // Rojo
    } else {
      categoriaInfo = calculateCategory(edad);
    }

    // Check if cedula already exists
    const [existing] = await db.pool.execute(
      'SELECT id FROM inscriptions WHERE cedula = ?',
      [cedula]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Ya existe una inscripción con esta cédula' });
    }

    // Insert inscription
    const [result] = await db.pool.execute(
      `INSERT INTO inscriptions 
       (nombres, apellidos, cedula, email, telefono, fecha_nacimiento, edad, genero, 
        categoria, color_categoria, talla_camiseta, contacto_emergencia, telefono_emergencia) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombres, apellidos, cedula, email, telefono, fecha_nacimiento, edad, genero,
       categoriaInfo.categoria, categoriaInfo.color, talla_camiseta, 
       contacto_emergencia, telefono_emergencia]
    );

    res.status(201).json({
      message: 'Inscripción exitosa',
      id: result.insertId,
      categoria: categoriaInfo.categoria,
      color: categoriaInfo.color
    });
  } catch (error) {
    console.error('Inscription error:', error);
    res.status(500).json({ message: 'Error al procesar la inscripción' });
  }
});

// Get all inscriptions (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [inscriptions] = await db.pool.execute(
      'SELECT * FROM inscriptions ORDER BY fecha_inscripcion DESC'
    );
    res.json(inscriptions);
  } catch (error) {
    console.error('Get inscriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inscriptions grouped by category (admin only)
router.get('/by-category', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.pool.execute(
      `SELECT categoria, color_categoria, COUNT(*) as total,
        SUM(CASE WHEN genero = 'M' THEN 1 ELSE 0 END) as hombres,
        SUM(CASE WHEN genero = 'F' THEN 1 ELSE 0 END) as mujeres
       FROM inscriptions 
       GROUP BY categoria, color_categoria 
       ORDER BY FIELD(categoria, 'Recreativa', 'Libre', 'A', 'B', 'C')`
    );
    res.json(rows);
  } catch (error) {
    console.error('Get by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [total] = await db.pool.execute('SELECT COUNT(*) as count FROM inscriptions');
    const [hombres] = await db.pool.execute('SELECT COUNT(*) as count FROM inscriptions WHERE genero = "M"');
    const [mujeres] = await db.pool.execute('SELECT COUNT(*) as count FROM inscriptions WHERE genero = "F"');
    
    res.json({
      total: total[0].count,
      hombres: hombres[0].count,
      mujeres: mujeres[0].count
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete inscription (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.pool.execute('DELETE FROM inscriptions WHERE id = ?', [id]);
    res.json({ message: 'Inscripción eliminada' });
  } catch (error) {
    console.error('Delete inscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
