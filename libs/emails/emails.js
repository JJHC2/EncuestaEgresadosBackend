const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "al222110834@gmail.com",
    pass: "sfpj tbgi ljfi finy",
  },
});

const sendResetEmail = (user_email, resetToken) => {
  const mailOptions = {
    from: "al222110834@gmail.com",
    to: user_email,
    subject: "Solicitud de Restablecimiento de Contraseña",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                
                <!-- Contenido Principal -->
                <div style="padding: 20px;">
                    <h2 style="color: #4CAF50; text-align: center;">Restablece tu Contraseña</h2>
                    <p style="font-size: 16px; color: #333; text-align: center;">
                        ¡Hola! Hemos recibido una solicitud para restablecer tu contraseña. Si no solicitaste este cambio, puedes ignorar este mensaje. De lo contrario, haz clic en el botón de abajo para restablecer tu contraseña.
                    </p>
                    
                    <!-- Botón de Acción -->
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${process.env.RESET_PASSWORD}/${resetToken}" style="background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 128, 0, 0.3);">
                            Restablecer Contraseña
                        </a>
                    </div>
                    
                    <!-- Instrucción de Respaldo -->
                    <p style="font-size: 14px; color: #777; text-align: center;">
                        Este enlace es válido por 15 minutos.
                    </p>
                    
                    <!-- Línea de Separación -->
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    
                    <!-- Enlace Alternativo -->
                    <p style="font-size: 12px; color: #aaa; text-align: center;">
                        Si tienes problemas para hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:
                    </p>
                    <p style="font-size: 12px; color: #4CAF50; text-align: center; word-break: break-all;">
                        <a href="${process.env.RESET_PASSWORD}/${resetToken}" style="color: #4CAF50;">
                            ${process.env.RESET_PASSWORD}/${resetToken}
                        </a>
                    </p>
                </div>
            </div>
        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error al enviar correo: ", error);
    }
    console.log("Correo enviado: " + info.response);
  });
};

module.exports = sendResetEmail;
