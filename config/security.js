require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ISSUER: process.env.JWT_ISSUER || 'bp-login-mid',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'bp-users'
};
