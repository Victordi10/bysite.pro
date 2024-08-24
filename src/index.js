const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
const port = process.env.PORT || 3000;
const host = process.env.HOSTDB
const cors = require('cors');

const {obtenerNombre_idUnico } = require("./models/tiendaModel.js")
const {indexTiendaDominio} = require("./controllers/tiendaController")
// Routers
const regisUsers = require('./routes/registroUserRoutes');
const ingresar = require('./routes/loginRoutes');
const productos = require('./routes/productosRoutes');
const suscripcion = require('./routes/suscripcionRoutes');
const negocios = require('./routes/negocioRoutes');
const tienda = require('./routes/tiendaRoutes');
const buscador = require('./routes/buscadorRoutes')
const categorias = require('./routes/categoriaRoutes')
const webhook = require('./routes/webhooks')


const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET, // Clave secreta para firmar la cookie de sesión
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 60 * 1000 } // 5 horas en milisegundos
}));

// Middleware para detectar subdominios
app.use(async (req, res, next) => {
    //console.log("Host completo:", req.headers.host);
    const hostParts = req.headers.host.split('.');
    //console.log("Partes del host:", hostParts);

    const subdomain = hostParts.length > 1 ? hostParts[0] : null; // Ajuste para manejar mejor los subdominios
    //console.log("Subdominio detectado:", subdomain);

    if (subdomain && subdomain !== 'www' && subdomain !== 'bysite' && subdomain !== 'app' && subdomain !== 'registrarse' && subdomain !== 'sites') {
        try {
            const negocio = await obtenerNombre_idUnico(subdomain); // Asume que esta función verifica el subdominio en la base de datos
            req.negocio = negocio ? negocio : null;
        } catch (err) {
            console.error("Error al verificar el subdominio:", err);
            req.negocio = null;
        }
    }
    
    req.subdomain = subdomain;
    next();
});


// Routes
app.get('/', async (req, res) => {
    if (req.negocio === null) {
        res.sendFile(path.join(__dirname, '../public/pagina404.html'));
    } else if (req.negocio) {
        await indexTiendaDominio(req, res);
    } else if (req.subdomain === 'app') {
        res.sendFile(path.join(__dirname, '../public/login.html'));
    } else if (req.subdomain === 'registrarse') {
        res.sendFile(path.join(__dirname, '../public/registrar.html'));
    } else if (req.subdomain === 'sites') {
        res.sendFile(path.join(__dirname, '../public/sites.html'));
    } else {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});


// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public/venta')));
app.use(express.static(path.join(__dirname, '../public/js')));
app.use(express.static(path.join(__dirname, '../public/css')));
app.use(express.static(path.join(__dirname, '../public/usuarios')));
app.use(express.static(path.join(__dirname, '../public/correos')));
app.use(express.static(path.join(__dirname, '../public/venta/img')));


app.use(webhook)


// Middleware to verify session
function verificarSesion(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect(`http://${req.headers.host}/login.html`);
    }
}


// Routes
app.use(tienda);
app.use(regisUsers);
app.use(ingresar);

//logica para cerrar sesion
app.get("/panel.html/cerrar", negocios);
app.get("/panel.html/verificar-sesion", negocios)


// Lógica para acceder al panel, verificar la sesión antes de acceder a estas rutas
app.use(negocios, verificarSesion);
app.use(productos, verificarSesion);
app.use(buscador,verificarSesion)
app.use(categorias,verificarSesion)
app.use(suscripcion,verificarSesion);




app.listen(port, () => {
    console.log(`Servidor esta escuchando en https://${host}:${port}`);
});
