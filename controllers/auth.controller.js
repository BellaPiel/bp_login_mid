const db = require('../database/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'eSWGSefmDNtD3HqxqDk50K33CmTaErxXXZDqM20V0jD';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    /* ================= VALIDACIÓN ================= */
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y password son obligatorios'
      });
    }

    /* ================= USUARIO + ROL ================= */
    const [usuarios] = await db.query(`
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.password,
        r.nombre AS rol
      FROM usuarios u
      INNER JOIN roles r ON r.id = u.rol_id
      WHERE u.email = ?
    `, [email]);

    if (!usuarios.length) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    const usuario = usuarios[0];

    /* ================= PASSWORD ================= */
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    /* ================= ROLES ================= */
    const roles = [usuario.rol.toLowerCase()]; // array de roles

    /* ================= JWT ================= */
    const token = jwt.sign(
      {
        sub: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        roles: roles   // 👈 ahora es array
      },
      SECRET,
      { expiresIn: '2h' }
    );

    /* ================= RESPONSE ================= */
    return res.json({
      ok: true,
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        roles: roles   // 👈 array
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};
