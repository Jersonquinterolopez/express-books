const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

// Settings
app.listen(process.env.PORT || 5000, () => {
  console.log('listening on *:5000');
});
app.set('views', path.join(__dirname, 'views'));
// esta linea de codigo nos va a concatenar __dirname con views mediante el modulo path, sencillamente esta parte lo que va hacer es ubicar nuestra carpeta views.
app.set('view engine', 'ejs');
//este es el motor de plantillas , con express no necesita ser requerido - se installa con - npm i ejs

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
// gracias a este metodo vamos a poder entender lo que viene del formulario .urlencoded puede entender los datos que vienen desde el formulario y convertirlos a Json para poder utilizarlo

// Routes
app.use(require('./routes/index'));

// Static
app.use(express.static(path.join(__dirname, 'public')));
// como express interpreta que las carpetas estan en la raiz principal en este caso queremos especificar la ubicacion de la carpeta public ya que este dentro de src , lo hacemos con __dirname y le especificamos que sea la carpeta 'public'.

// 404 handler
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

// el status(404) es el estado, internamente los mensajes tienen un estado http, en este caso le vamos a enviar el 404 que significa que un archivo no se ha encontrado // res.status(404) es para el navegador y el el mensaje es para el usuario.

module.exports = app;
