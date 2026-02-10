const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'super-secret-key';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y password son obligatorios'
      });
    }

    const [usuarios] = await db.query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?',
      [email]
    );

    if (!usuarios.length) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    const usuario = usuarios[0];

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales inválidas'
      });
    }

    // 🔐 JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      ok: true,
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
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
