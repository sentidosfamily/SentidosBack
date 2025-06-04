const mongoose = require("mongoose");

const SocioPorCiudadSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true },
  cuota: { type: Number, default: 12 }, // Agregar la cuota como campo con valor por defecto 12
  provincia: { type: String, required: true },
  ciudad: { type: String, required: true },
  socioId: { type: mongoose.Schema.Types.ObjectId, ref: "Socio" },
});

module.exports = mongoose.model("SocioPorCiudad", SocioPorCiudadSchema);
