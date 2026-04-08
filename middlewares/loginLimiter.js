const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 20,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    ok:false,
    message:'Demasiados intentos de login. Intente más tarde.'
  },

  handler: (req, res) => {
    console.warn('⚠️ RATE LIMIT LOGIN:', req.ip);
    res.status(429).json({
      ok:false,
      message:'Demasiados intentos. Espere 15 minutos.'
    });
  }

});

module.exports = loginLimiter;
