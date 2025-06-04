const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const sociosRoutes =  require('./routes/authSocios')
const changePassword =  require('./routes/changePassword')
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const routesActividades = require('./routes/routesActividades');
const activeRoutes = require('./routes/activeRoutes');

// const testRoutes = require('./routes/authSocios');  // Importamos las rutas

// Usamos las rutas
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Rutas
// app.use('/api', testRoutes);
app.use('/api', changePassword);
app.use('/api/auth', authRoutes);
app.use('/api',sociosRoutes);
app.use('/api',postRoutes);
app.use('/api', uploadRoutes);
app.use('/api', activeRoutes);
app.use('/api/actividades', routesActividades);


// Ruta de prueba
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Ruta de prueba funcionando correctamente del backend' });
});
// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión', err));

// Puerto
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
