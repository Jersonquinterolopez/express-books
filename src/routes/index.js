const { Router } = require('express');
const router = Router();
const fs = require('fs');
const uuid = require('uuid/v4');

// el modulo fs o file system nos sirve para leer los archivos del sistema , lo requerimos para leer el books.json(nuestra base de datos), para poder guardarle los datos del arreglo books.
// dato importante!: este modulo no necesitamos descargarlo, ya viene con nodejs por defecto.

// en el arreglo books guardamos la data, inicialmente cada vez que iniciabamos la app los datos se borraban, ya que se reiniciaba el arreglo porque estaba vacio (const books = []) , pero ahora vamos a leer el archivo books.json con los datos previos usando el metodo readFileSync() que de hecho hace lo mismo que writeFileSync() pero a diferencia de escribir va a leer data y la vamos a guardar en una constante en este caso json_books /// de esta manera se van agregar mas datos cada vez que se envie una peticion aun asi se reinicie la aplicacion, esto lo hacemos con JSON.parse(json_books) pasandole como argumento el arreglo con la data anterior.

const json_books = fs.readFileSync('src/books.json', 'utf-8');
let books = JSON.parse(json_books);

// De esta forma ponemos rutas en nuestra app , en este caso las llamamos desde la carpeta views y las declaramos aqui:

router.get('/', (req, res) => {
  res.render('index.ejs', {
    // aqui decimos: una vez renderize la pagina principal , no solamente quiero que renderizes el index.ejs si no que tambien te voy a pasar esta lista que contiene data:
    books
  });
});

router.get('/new-entry', (req, res) => {
  res.render('new-entry');
});

//especificamos el destino de la peticion y lo que se hara con ella , con la data , obviamente utilizamos el metodo post ya que nos permite enviar la data por cabecera es un metodo seguro, y le enviamos un mensaje al cliente diciendole que recibimos su data.

router.post('/new-entry', (req, res) => {
  // aqui ingresan los datos y los validamos aqui , pasandolos por una constante
  const { title, author, image, description, drama, horror } = req.body;
  // them preguntamos si estan los datos?
  if (!title || !author || !image || !description) {
    // si los datos no estan en el form enviamos 404 para el navegador y un mensaje para el lado del cliente , recordemos que siempre tenemos que enviar los dos mensajes para que tanto el navegador como el cliente sepan que paso.
    res.status(400).send('Entries must have a title and description');
    return;
  }

  // si los datos han sido validados los pasamos por este objeto para darle formato.
  let newBook = {
    id: uuid(),
    //la funcion de uuid nos va a dar un id nuevo por cada dato agregado para poder identificarlo en nuestra app.
    title,
    author,
    image,
    description,
    drama,
    horror
  };

  // aqui le decimos que inyecte el objeto newBook (lo pasamos como argumento) a el arreglo books que esta definido al principio.
  books.push(newBook);

  // con el metodo stringify vamos a convertir nuestro arreglo (books) en strings y lo vamos a guardar en una constante para pasarselo como parametro a writeFileSync para que lo escriba en la base de datos books.json
  const json_books = JSON.stringify(books);

  // con fs.writeFileSync lo que hacemos es escribir sobre nuestra base de datos (books.json) (fs.writeFileSync lee una ruta relativa , en este caso 'src/books.json')

  //fs.writeFileSync va a crear un archivo books.json si no existe , para escribirlo pero si existe simplemente va a escribir sobre el.

  // tambien al final le damos un formato de codificacion de caracteres utf-8 a nuestro json.
  fs.writeFileSync('src/books.json', json_books, 'utf-8');

  // res.send('received');
  // y si todo sale bien enviamos un mensaje de received.

  res.redirect('/');
  // aqui le decimos que cuando termine de recibir los datos redireccione a el cliente a la pagina de inicio.
});

//aqui creamos el enrutador delete que se va encargar de recibir el id del objeto que queremos eliminar le pasamos un :id que es donde va ir el id que recibamos. y el console.log nos va a mostrar en consola el id del objeto que queremos eliminar o tambien lo podemos ver en la url ya que esta es una peticion con el metodo get. asi ya el servidor tiene el id del objeto que vamos a eliminar
router.get('/delete/:id', (req, res) => {
  // console.log(req.params);
  // res.send('received');

  // El método filter ( ) crea una nueva matriz(arreglo) con todos los elementos que pasan la prueba o condicion en este caso implementada por la función proporcionada que como resultado nos da false la condicion.

  // lo que entiendo hasta el momento con este algoritmo es que empezamos recorriendo con filter todos los elementos de books, creamos un nuevo arreglo que en este caso ya no llevara el objeto que le estamos pasando como condicion por medio de la funcion que esta como argumento, ya que el resultado de esa comparacion es false , el algoritmo sobreescribira y ya no tendremos ese objeto en pantalla ni en la base de datos , puesto que sera eliminado ya que la comparacion(que esta como argumento como una condicion) dio false.

  books = books.filter(book => book.id != req.params.id);
  const json_books = JSON.stringify(books);
  fs.writeFileSync('src/books.json', json_books, 'utf-8');
  res.redirect('/');
});

module.exports = router;
