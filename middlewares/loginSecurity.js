const attempts = new Map();

/*
estructura:

email → {
   count,
   lockUntil,
   lastTry
}
*/

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 min

function loginSecurity(req, res, next) {

  const email = (req.body?.email || '').toLowerCase();

  if (!email) return next();

  const data = attempts.get(email);

  if (!data) return next();

  // si está bloqueado
  if (data.lockUntil && data.lockUntil > Date.now()) {

    return res.status(429).json({
      ok:false,
      message:'Cuenta temporalmente bloqueada por seguridad'
    });

  }

  next();
}

/* registrar fallo */
loginSecurity.fail = (email) => {

  email = email.toLowerCase();

  const data = attempts.get(email) || { count:0 };

  data.count++;

  if (data.count >= MAX_ATTEMPTS) {

    data.lockUntil = Date.now() + LOCK_TIME;
    data.count = 0;

    console.warn('🔒 LOGIN BLOQUEADO:', email);

  }

  attempts.set(email, data);
};

/* reset si login correcto */
loginSecurity.success = (email) => {
  attempts.delete(email.toLowerCase());
};

module.exports = loginSecurity;
