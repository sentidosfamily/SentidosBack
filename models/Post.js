const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  epigrafe: { type: String },
  portada: { type: String }, // URL imagen portada
  contenido: { type: String, required: true },
  imagenes: [String], // URLs imágenes insertadas
  epigrafes: [String], // epígrafes para cada imagen
  categoria: [String],
  avatar: { type: String },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
