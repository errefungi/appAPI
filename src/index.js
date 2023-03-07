const express = require('express'); //se indica que se requiere express
const morgan = require('morgan'); //se indica que se requiere morgan
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const app = express(); // se inicia express y se instancia en una constante de nombre app.

// settings
app.set('port', 3000); //se define el puerto en el cual va a funcionar el servidor

// Utilities
app.use(morgan('dev')); //se indica que se va a usar morgan en modo dev
app.use(express.json()); //se indica que se va a usar la funcionalidad para manejo de json de express
var path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a la base de datos
const pool = mysql.createPool({
    port: 3307, 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'almacen'
});

// Set rutas para los archivos
// app.use(require('.\\rutas.js'));

// Rutas para productos
app.get('/productos', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM productos');
    conn.release();
    res.json(rows);
});
app.get('/productos/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM productos WHERE id = ?',
        [req.params.id]);
    conn.release();
    if (rows.length === 0) return res.status(404).send('Producto no encontrado');
res.json(rows[0]);
});

app.post('/productos', async (req, res) => {
    console.log(req.body);
    const conn = await pool.getConnection();
    const [result] = await conn.query('INSERT INTO productos VALUES (null, ?, ?, ?)', 
    [req.body.name, req.body.description, req.body.price]);
    const [rows] = await conn.query('SELECT * FROM productos WHERE id = ?',
        [result.insertId]);
    conn.release();
    res.json({"Insertaste con exito a":rows[0]});
});
app.put('/productos/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query('UPDATE productos SET nombre=?,descripcion =?, precio =? WHERE id =? ',
        [req.body.nombre, req.body.descripcion, req.body.precio, req.params.id]);
    const [rows] = await conn.query('SELECT * FROM productos WHERE id = ?',
        [req.params.id]);
    conn.release();
    res.json(rows[0]);
});
app.delete('/productos/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('DELETE FROM productos WHERE id = ?',
        [req.params.id]);
    conn.release();
    res.send("producto borrado");
});


// CODIGO PARA LA API DE USARIOS

app.get('/customers', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM customers');
    conn.release();
    res.json(rows);
});

app.get('/customers/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM customers WHERE id = ?',
        [req.params.id]);
    conn.release();
    if (rows.length === 0) return res.status(404).send('Custumer no encontrado');
res.json(rows[0]);
});

app.get('/customers/:name/:password', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query ('SELECT * FROM customers WHERE name = ? AND password = ?',
    [req.params.name, req.params.password]);
    conn.release();
    if (rows.length === 0) return res.status(404).send('No existe ese cliente');
    res.json(rows[0])
});

app.post('/customers', async (req, res) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query('INSERT INTO customers VALUES (null, ?, ?, ?)', 
    [req.body.name, req.body.email, req.body.password]);
    const [rows] = await conn.query('SELECT * FROM customers WHERE id = ?',
    [result.insertId]);
    conn.release();
    res.json(rows[0]);
});

app.put('/customers/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [result] = await conn.query('UPDATE customers SET name=?,email =?, password =? WHERE id =? ',
    [req.body.nombre, req.body.descripcion, req.body.precio, req.params.id]);
    const [rows] = await conn.query('SELECT * FROM customers WHERE id = ?',
    [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

app.delete('/customers/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('DELETE FROM customers WHERE id = ?',
    [req.params.id]);
    conn.release();
    res.send("producto borrado");
});


// rutas para los archivos
app.get('/consultar', async (req, res) => {
    res.sendFile(path.resolve('src/vista/consulta.html'))
})

app.get('/home', async (req, res) => {
    res.sendFile(path.resolve('src/vista/home.html'))
})
app.get('/', async (req, res) => {
    res.sendFile(path.resolve('src/vista/home.html'))
})

app.get('/ingresar', async (req, res) => {
    res.sendFile(path.resolve('src/vista/ingreso.html'))
})
// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log("Servidor funcionando");
}); //se inicia el servidor en el puerto definido y se pone un mensaje en la consola