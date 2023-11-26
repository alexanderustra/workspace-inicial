const express = require("express");
const cors = require("cors");
const mariadb = require("mariadb");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const methodOverride = require('method-override');

const secretKey = 'secret-key';

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "46302629",
  database: "eComerce_data",
  connectionLimit: 50,
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
// Asegúrate de configurar correctamente el middleware para aceptar el método DELETE
app.use(methodOverride('_method', { methods: ['POST', 'GET', 'DELETE'] }));



// Middleware para validar el token
const validarToken = (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    const decoded = jwt.verify(token, secretKey);
    
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }
    // Verificar el token
    jwt.verify(token, secretKey, (err, decoded) => {
      console.log('Token Decodificado AAAA:', decoded);
      if (err) {
        return res.status(401).json({ message: "Token inválido" });
      }
      // Decodificado correctamente, establece la información del usuario en la solicitud
      req.user = decoded;
      next();
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Error al validar el token: ' + error.message });
  }
}; 

// Middleware para validar el token en rutas específicas
app.use(['/carrito', '/agregar-al-carrito', '/eliminar-del-carrito','/productos/:id','/cat_productos/:id'], validarToken);

//LOGIN ------------------ //

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'tuki@gmail.com' && password === '1234') {
    const token = jwt.sign({ username }, secretKey);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Usuario y/o contraseña incorrectos' });
  }
});

// Ruta para obtener un producto por id
app.get("/productos/:id", (req, res) => {
  const id = req.params.id;
  try {
    // Lee el archivo JSON directamente desde el sistema de archivos
    const data = fs.readFileSync(`./json/products/${id}.json`);
    const productos = JSON.parse(data);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al leer el archivo JSON: " + error.message });
  }
});

// Ruta para obtener el carrito
app.get("/carrito", (req, res) => {
  try {
    // Lee el archivo JSON directamente desde el sistema de archivos
    const data = fs.readFileSync("./json/user_cart/25801.json");
    const tareas = JSON.parse(data);
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: "Error al leer el archivo JSON: " + error.message });
  }
});

//ruta para obtener todas las categorías

// Ruta para obtener el carrito
app.get("/categorias", (req, res) => {
  try {
    // Lee el archivo JSON directamente desde el sistema de archivos
    const data = fs.readFileSync("./json/cats/cat.json");
    const tareas = JSON.parse(data);
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: "Error al leer el archivo JSON: " + error.message });
  }
});

// Ruta para obtener los productos de categorías

app.get("/cat_productos/:id", (req, res) => {
  const id = req.params.id;
  try {
    // Lee el archivo JSON directamente desde el sistema de archivos
    const data = fs.readFileSync(`./json/cats_products/${id}.json`);
    const tareas = JSON.parse(data);
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ message: "Error al leer el archivo JSON: " + error.message });
  }
});

//---------------- DESAFIATE ---------------------//


// Ruta para agregar un producto al carrito
app.post('/agregar-al-carrito', (req, res) => {
  const newProduct = req.body;
  const userId = 25801;

  try {
    // Lee el archivo JSON directamente desde el sistema de archivos
    const filePath = `./json/user_cart/${userId}.json`;
    const data = fs.readFileSync(filePath);
    const cartData = JSON.parse(data);

    // Agrega el nuevo producto al carrito
    cartData.articles.push(newProduct);

    // Guarda el carrito actualizado en el archivo
    fs.writeFileSync(filePath, JSON.stringify(cartData, null, 2));

    res.json({ message: 'Producto agregado al carrito exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito: ' + error.message });
  }
});


// Ruta para eliminar un producto del carrito por ID

app.delete('/eliminar-del-carrito/:productId', (req, res) => {
  const userId = 25801;
  const productId = parseInt(req.params.productId);

  try {
    // Lee el archivo JSON directamente desde el sistema de archivos
    const filePath = `./json/user_cart/${userId}.json`;
    const data = fs.readFileSync(filePath);
    let cartData = JSON.parse(data);

    // Encuentra el índice del producto con el ID proporcionado
    const indexToRemove = cartData.articles.findIndex((article) => article.id === productId);

    if (indexToRemove !== -1) {
      // Elimina el producto del array
      cartData.articles.splice(indexToRemove, 1);

      // Guarda el carrito actualizado en el archivo
      fs.writeFileSync(filePath, JSON.stringify(cartData, null, 2));

      res.json({ message: 'Producto eliminado del carrito exitosamente' });
    } else {
      console.log('Producto no encontrado en el carrito');
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto del carrito: ' + error.message });
  }
});  



app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});