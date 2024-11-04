const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'al222110834@gmail.com',
        pass: 'sfpj tbgi ljfi finy' 
    }
});


const sendResetEmail = (user_email, resetToken) => {
    const mailOptions = {
        from: 'al222110834@gmail.com',
        to: user_email,
        subject: 'Restablecer Contraseña',
        html: `<h1>Restablecer Contraseña</h1>
               <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
               <a href="http://localhost:3000/reset-password/${resetToken}">Restablecer Contraseña</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error al enviar correo: ', error);
        }
        console.log('Correo enviado: ' + info.response);
    });
};

module.exports = sendResetEmail;
