const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { insertIncomingMessage, insertOutgoingMessage } = require('./database');

const whatsapp = new Client({
  authStrategy: new LocalAuth()
});

// whatsapp
whatsapp.on('qr', qr => {
  qrcode.generate(qr, {
    small: true
  });
});

whatsapp.on('ready', () => {
  console.log('Client is ready!');
});

whatsapp.on('message', async message => {
  // Guardar el mensaje entrante en la base de datos
  insertIncomingMessage(message.from, message.body, new Date().toISOString());
});

whatsapp.on('message_create', async message => {
    // Verificar si el mensaje es saliente
    if (message.fromMe) {
      // Aquí se capturan los mensajes salientes (mensajes que tu aplicación envía)
      // Los mensajes salientes tienen el evento 'message_create'
  
      // Si necesitas almacenar información adicional sobre los mensajes salientes,
      // como el destinatario o algún otro detalle, puedes hacerlo aquí.
      const destinatario = message.to;
      const cuerpoMensaje = message.body;
  
      // Guardar el mensaje saliente en la base de datos
      insertOutgoingMessage(destinatario, cuerpoMensaje, new Date().toISOString());
    }
  });
  

// end whatsapp

whatsapp.initialize();
