const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('whatsapp_messages.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS incoming_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        remitente TEXT NOT NULL,
        cuerpo_mensaje TEXT NOT NULL,
        fecha_hora DATETIME NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS outgoing_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        destinatario TEXT NOT NULL,
        cuerpo_mensaje TEXT NOT NULL,
        fecha_hora DATETIME NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS conversaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contacto TEXT NOT NULL,
        cuerpo_mensaje TEXT NOT NULL,
        fecha_hora DATETIME NOT NULL,
        tipo TEXT NOT NULL
      )
    `);
  }
});

const insertIncomingMessage = (remitente, cuerpoMensaje, fechaHora) => {
  db.run('INSERT INTO incoming_messages (remitente, cuerpo_mensaje, fecha_hora) VALUES (?, ?, ?)', [remitente, cuerpoMensaje, fechaHora]);
  db.run('INSERT INTO conversaciones (contacto, cuerpo_mensaje, fecha_hora, tipo) VALUES (?, ?, ?, ?)', [remitente, cuerpoMensaje, fechaHora, 'incoming']);
};

const insertOutgoingMessage = (destinatario, cuerpoMensaje, fechaHora) => {
  db.run('INSERT INTO outgoing_messages (destinatario, cuerpo_mensaje, fecha_hora) VALUES (?, ?, ?)', [destinatario, cuerpoMensaje, fechaHora]);
  db.run('INSERT INTO conversaciones (contacto, cuerpo_mensaje, fecha_hora, tipo) VALUES (?, ?, ?, ?)', [destinatario, cuerpoMensaje, fechaHora, 'outgoing']);
};

module.exports = {
  insertIncomingMessage,
  insertOutgoingMessage,
};
