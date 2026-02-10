require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTA AUTH
app.use('/api/auth', require('./routes/auth.routes'));

app.listen(port, () => {
  console.log(`✅ API Login JWT corriendo en http://localhost:${port}`);
});
