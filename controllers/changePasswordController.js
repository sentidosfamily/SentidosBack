const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configura tu transporte de Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // el servidor SMTP de Gmail
  port: 465, // puerto seguro SSL
  secure: true,
  auth: {
    user: "sentidospadres@gmail.com",
    pass: "pjcs dzob wtjk wetc", // Generá una "contraseña de aplicación" desde tu cuenta Google
  },
});

// Enviar código al correo
const sendVerificationCode = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ error: "Correo requerido." });
  }

  try {
    const user = await User.findOne({ username: correo.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const code = crypto.randomInt(100000, 999999).toString(); // Código de 6 dígitos
    const expiresAt = new Date(Date.now() + 15 * 60000); // 15 minutos

    await VerificationCode.findOneAndUpdate(
      { correo: correo.toLowerCase() },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: '"Sentidos Soporte" <sentidospadres@gmail.com>',
      to: correo,
      subject: "Código de verificación",
      html: `
<div style="font-family: Arial, sans-serif; color: #333;">
  <p>Hola,</p>

  <p>Tu código de verificación es:</p>

  <p style="font-size: 24px; color: #007bff; font-weight: bold;">
    ${code}
  </p>

  <p>⚡ Este código es válido por <strong>15 minutos</strong>.</p>

  <p style="color: red; font-weight: bold;">
    Por favor, no compartas este código con nadie.
  </p>

  <p style="font-size: 12px; color: gray;">
    Si no solicitaste este código, simplemente ignora este correo.
  </p>

  <p>¡Gracias! Equipo Sentidos</p>
</div>
`,
    });

    res.json({ message: "Código enviado al correo." });
  } catch (error) {
    console.error("Error enviando código:", error);
    res.status(500).json({ error: "Error al enviar el código." });
  }
};

// Cambiar la contraseña usando el código
const changePassword = async (req, res) => {
  const { correo, nuevaPassword, code } = req.body;

  if (!correo || !nuevaPassword || !code) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  try {
    const verification = await VerificationCode.findOne({
      correo: correo.toLowerCase(),
      code,
    });
    if (!verification || verification.expiresAt < new Date()) {
      return res.status(400).json({ error: "Código inválido o expirado." });
    }

    const user = await User.findOne({ username: correo.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    user.password = nuevaPassword;
    await user.save();

    await VerificationCode.deleteOne({ _id: verification._id });

    res.json({ message: "Contraseña actualizada exitosamente." });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = { sendVerificationCode, changePassword };
