const fs = require('fs');
const path = require('path');

const buildMarker = `${path.sep}.builds${path.sep}versions${path.sep}`;
const serverDirectory = __dirname;
const markerIndex = serverDirectory.indexOf(buildMarker);

const domainRoot = markerIndex >= 0
  ? serverDirectory.slice(0, markerIndex)
  : path.join(serverDirectory, '..');

const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(domainRoot, 'uploads');

fs.mkdirSync(uploadsDir, { recursive: true });

function recoverLegacyUploads() {
  if (markerIndex < 0) {
    return 0;
  }

  const versionsDir = path.join(domainRoot, '.builds', 'versions');
  if (!fs.existsSync(versionsDir)) {
    return 0;
  }

  let recovered = 0;

  for (const version of fs.readdirSync(versionsDir)) {
    const legacyDir = path.join(versionsDir, version, 'nodejs', 'uploads');
    if (!fs.existsSync(legacyDir) || path.resolve(legacyDir) === path.resolve(uploadsDir)) {
      continue;
    }

    for (const entry of fs.readdirSync(legacyDir, { withFileTypes: true })) {
      if (!entry.isFile()) {
        continue;
      }

      const source = path.join(legacyDir, entry.name);
      const destination = path.join(uploadsDir, entry.name);

      if (!fs.existsSync(destination)) {
        fs.copyFileSync(source, destination);
        recovered += 1;
      }
    }
  }

  return recovered;
}

module.exports = { uploadsDir, recoverLegacyUploads };
