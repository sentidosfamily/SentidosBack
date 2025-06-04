const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();
// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dcwwhkqb2',
  api_key: '788922753142331',
  api_secret:'GApym06yGKC6ukfOweG-EwKW2Ng',
});

// Configuración de Multer para subir archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { cloudinary, upload };
