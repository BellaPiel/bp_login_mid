const jwt = require('jsonwebtoken');

module.exports = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({ ok: false, message: 'Token requerido' });
    }

    const token = auth.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (rolesPermitidos.length > 0) {
        // Aquí revisamos todos los roles del token
        const userRoles = decoded.roles || [];
        const tieneRol = rolesPermitidos.some(r => userRoles.includes(r));

        if (!tieneRol) {
          return res.status(403).json({
            ok: false,
            message: 'No autorizado por rol'
          });
        }
      }

      next();
    } catch (err) {
      return res.status(401).json({ ok: false, message: 'Token inválido' });
    }
  };
};
