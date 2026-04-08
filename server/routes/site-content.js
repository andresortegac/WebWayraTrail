const express = require('express');
const { pool } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { defaultHomeContent, normalizeHomeContent } = require('../siteContentDefaults');

const router = express.Router();
const FALLBACK_MAX_ALLOWED_PACKET = 1024 * 1024;

let cachedMaxAllowedPacket = null;
let cachedPacketTimestamp = 0;

const formatKilobytes = (bytes) => `${Math.max(1, Math.round(bytes / 1024))} KB`;

async function getMaxAllowedPacket() {
  const now = Date.now();

  if (cachedMaxAllowedPacket && now - cachedPacketTimestamp < 60_000) {
    return cachedMaxAllowedPacket;
  }

  try {
    const [rows] = await pool.query("SHOW VARIABLES LIKE 'max_allowed_packet'");
    const configuredValue = Number(rows?.[0]?.Value);

    cachedMaxAllowedPacket = Number.isFinite(configuredValue) && configuredValue > 0
      ? configuredValue
      : FALLBACK_MAX_ALLOWED_PACKET;
  } catch (error) {
    console.error('Get max_allowed_packet error:', error);
    cachedMaxAllowedPacket = FALLBACK_MAX_ALLOWED_PACKET;
  }

  cachedPacketTimestamp = now;
  return cachedMaxAllowedPacket;
}

async function readHomeContent() {
  const [rows] = await pool.execute(
    'SELECT content_json FROM site_content WHERE content_key = ? LIMIT 1',
    ['home']
  );

  if (rows.length === 0) {
    return defaultHomeContent;
  }

  try {
    return normalizeHomeContent(JSON.parse(rows[0].content_json));
  } catch (error) {
    console.error('Home content parse error:', error);
    return defaultHomeContent;
  }
}

router.get('/home', async (_req, res) => {
  try {
    const content = await readHomeContent();
    res.json(content);
  } catch (error) {
    console.error('Get home content error:', error);
    res.status(500).json({ message: 'No se pudo cargar el contenido del inicio' });
  }
});

router.put('/home', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const content = normalizeHomeContent(req.body);
    const serializedContent = JSON.stringify(content);
    const payloadBytes = Buffer.byteLength(serializedContent, 'utf8');
    const maxAllowedPacket = await getMaxAllowedPacket();
    const safePacketBudget = Math.max(256 * 1024, Math.floor(maxAllowedPacket * 0.9));

    if (payloadBytes > safePacketBudget) {
      return res.status(413).json({
        message:
          `Las imagenes del inicio pesan demasiado para el limite actual del servidor. ` +
          `Reduce su tamano o vuelve a subirlas mas comprimidas. ` +
          `Contenido actual: ${formatKilobytes(payloadBytes)}. ` +
          `Limite seguro del servidor: ${formatKilobytes(safePacketBudget)}.`,
      });
    }

    await pool.execute(
      `INSERT INTO site_content (content_key, content_json)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
         content_json = VALUES(content_json),
         updated_at = CURRENT_TIMESTAMP`,
      ['home', serializedContent]
    );

    res.json({
      message: 'Contenido del inicio actualizado correctamente',
      content,
    });
  } catch (error) {
    console.error('Update home content error:', error);
    if (error?.code === 'ECONNRESET') {
      return res.status(413).json({
        message:
          'Las imagenes del inicio superan el tamano que la base de datos permite guardar en este momento. ' +
          'Prueba con archivos mas livianos o comprimidos.',
      });
    }

    res.status(500).json({ message: 'No se pudo guardar el contenido del inicio' });
  }
});

module.exports = router;
