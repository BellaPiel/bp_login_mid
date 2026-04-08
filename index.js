  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');

  const app = express();
  const port = process.env.PORT || 3000;

  const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // RUTA AUTH
  app.use('/api/auth', require('./routes/auth.routes'));

  app.listen(port, () => {
    console.log(`✅ API Login JWT corriendo en http://localhost:${port}`);
  });
