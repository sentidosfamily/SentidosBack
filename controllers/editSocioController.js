const Socio = require('../models/Socio');
const Post = require('../models/Post');
const { cloudinary } = require('../utils/cloudinary');

const editSocio = async (req, res) => {
  try {
    const {
      _id,
      nombre,
      apellido,
      telefono,
      provincia,
      ciudad
    } = req.body;

    if (!_id) {
      return res.status(400).json({ success: false, message: "Falta el ID del socio" });
    }

    const socio = await Socio.findById(_id);
    if (!socio) {
      return res.status(404).json({ success: false, message: "Socio no encontrado" });
    }

    const getNombreCompleto = (nombre, apellido) => {
      return `${nombre?.trim() || ''} ${apellido?.trim() || ''}`.trim();
    };

    const autorViejo = getNombreCompleto(socio.nombre, socio.apellido); // antes de modificar

    // Actualizar datos del socio
    socio.nombre = nombre || socio.nombre;
    socio.apellido = apellido || socio.apellido;
    socio.telefono = telefono || socio.telefono;
    socio.provincia = provincia || socio.provincia;
    socio.ciudad = ciudad || socio.ciudad;

    // Subir avatar si se adjuntó archivo
    if (req.file) {
      const buffer = req.file.buffer;

      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'socios' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(buffer);
        });

      const result = await uploadFromBuffer();
      socio.avatar = result.secure_url;
    }

    await socio.save();

    const autorNuevo = getNombreCompleto(socio.nombre, socio.apellido);

    const updateFields = { autor: autorNuevo };
    if (socio.avatar) {
      updateFields.avatar = socio.avatar;
    }

    // Forzar coincidencia exacta y quitar espacios para comparar
    const regexMatch = new RegExp(`^${autorViejo.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i');

    const posts = await Post.find({ autor: regexMatch });

    if (posts.length > 0) {
      const updateResult = await Post.updateMany(
        { autor: regexMatch },
        { $set: updateFields }
      );
      console.log(`✅ Posts actualizados: ${updateResult.modifiedCount}`);
    } else {
      console.warn(`⚠️ No se encontraron Posts con autor exactamente igual a "${autorViejo}"`);
    }

    res.json({ success: true, message: "Socio y posts actualizados correctamente", socio });

  } catch (error) {
    console.error("❌ Error al editar socio:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

module.exports = { editSocio };
