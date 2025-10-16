// index.js

// 1. Importar las dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env

// 2. Configurar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite que el servidor entienda JSON

// 3. Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// 4. Definir el "molde" de nuestros datos (Schema)
const activitySchema = new mongoose.Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, required: true }
});
const Activity = mongoose.model('Activity', activitySchema);

// 5. Definir las rutas de la API (nuestros endpoints)

// Endpoint para guardar una nueva actividad
// Esta es la ruta que llamará tu Service Worker
app.post('/activitiesPost', async (req, res) => {
  try {
    const { text, timestamp } = req.body;
    const newActivity = new Activity({ text, timestamp });
    await newActivity.save();
    res.status(201).json({ message: 'Actividad guardada con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la actividad' });
  }
});

// Endpoint para obtener todas las actividades
// Lo usarás en tu frontend para mostrar las actividades sincronizadas
app.get('/activitiesGet', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
});

// 6. Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`🚀 App ${app}`)
});