const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeUserRole, isAdminRole } = require('./auth');

test('normaliza roles admin con aliases y nombres legacy', () => {
  assert.equal(normalizeUserRole('ADMIN'), 'admin');
  assert.equal(normalizeUserRole('Administrator'), 'admin');
  assert.equal(normalizeUserRole('SuperAdmin'), 'admin');
  assert.equal(normalizeUserRole('super-admin'), 'admin');
});

test('asigna rol admin por defecto para el usuario administrador legado sin role', () => {
  assert.equal(normalizeUserRole(undefined, 'admin'), 'admin');
  assert.equal(normalizeUserRole('', 'ADMIN'), 'admin');
});

test('mantiene roles no admin como usuarios normales', () => {
  assert.equal(normalizeUserRole('usuario'), 'user');
  assert.equal(normalizeUserRole('moderator'), 'moderator');
  assert.equal(isAdminRole('usuario'), false);
  assert.equal(isAdminRole('admin'), true);
});
