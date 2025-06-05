const express = require('express');
const router = express.Router();
const Actividad = require('../models/actividades');
const { upload } = require('../utils/cloudinary'); // Importar Cloudinary

// Crear actividad
router.post('/', async (req, res) => {
  try {
    const {
      titulo,
      imagen,
      fecha,
      hora,
      direccion,
      organizador,
      objetivo,
    } = req.body;

    let imagenSubida = 'https://via.placeholder.com/150';

    if (imagen) {
      const uploadRes = await upload(imagen);
      imagenSubida = uploadRes.secure_url;
    }

    const nuevaActividad = new Actividad({
      titulo,
      imagen: imagenSubida,
      fecha,
      hora,
      direccion,
      organizador,
      objetivo,
    });

    const saved = await nuevaActividad.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las actividades
router.get('/', async (req, res) => {
  try {
    const actividades = await Actividad.find().sort({ fecha: 1 });
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Editar actividad
router.put('/:id', async (req, res) => {
  try {
    const {
      titulo,
      imagen,
      fecha,
      hora,
      direccion,
      organizador,
      objetivo,
    } = req.body;

    const updateData = {
      titulo,
      fecha,
      hora,
      direccion,
      organizador,
      objetivo,
    };

    if (imagen) {
      const uploadRes = await upload(imagen);
      updateData.imagen = uploadRes.secure_url;
    }

    const updated = await Actividad.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Borrar actividad
router.delete('/:id', async (req, res) => {
  try {
    await Actividad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Actividad eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
