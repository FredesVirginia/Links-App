const express = require('express');
const morgan = require('morgan');
const exphbs= require( 'express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLSession= require('express-mysql-session');
//aqui estamos llamando a passsport.. no lo usaremos propieamente..
// si no es para ejecutar su codigod principal
const  passport =require('passport');
const {database} = require('./keys');
const path= require('path');


//inicializacion
 const app= express();
 //esto linea.. es para que la aplicacion se entere de que hay una secion
 require('./lib/passport');
 //ajustes
 const port= 8000;
 //aqui les estamos a node diciendo donde esta la Capeta View
 app.set('views', path.join(__dirname , 'views'))
 ///aqui hbs... es nombre de nuestro motor
 app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    //esto es para unir directorios.//estamos 
    //diciendo que la caperta Layoutsesta dentro de vista
    layoutsDir: path.join(app.get('views') , 'layouts'),
    partialsDir: path.join(app.get('views') , 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars.js')
 }));

 app.set('views engine' , '.hbs');

 //midewalres
 app.use(session({
    secret: 'HarrySession',
    resave: false,
    saveUninitialized:false,
    store: new MySQLSession(database)

 }));
 app.use(flash());
app.use(morgan('dev'));
//este midewalwere esta para recibir los datos que me envia el usuario por formularios
//el extendes false-> inidica que solo se va admitir texto, nada de imagenes y demas
app.use(express.urlencoded({extended:false}));
app.use(express.json());
//aqui estamos diciendo que passport inicie
app.use(passport.initialize());
// y passport no sabe donde va a guardar los datos... por se usamos session
//para guardar los datos y demas utiliza una secion ,, he aqui
app.use(passport.session());
//VARIABLES LOCALES

app.use((req, res, next)=>{
  //los traigo con succes.. porque asi lo he llamdo.. tanto dentro del parentesis
  //como despues del punto
 //y asi hgo disponible mi mensaje.. para todas mis vistas, en estos casos
 //se buscaran los mensaje suceess y message
   app.locals.success = req.flash('success');
   app.locals.message = req.flash('message');
  //con esto guardamos al usuario en la variable app.locasl.user.. asi esta disponible
  //en las vistas
  app.locals.user = req.user;
   console.log(app.locals.user);
    next();
});
app.use(require('./routes'));
app.use(require('./routes/autenticacion'));
app.use('/links',require('./routes/links'));
//roueter

//public 
//aqui estamos configurando donde van estar nuestros archivos publicos estaticos
app.use(express.static(path.join(__dirname, 'public')));
//server

app.listen(port, ()=>{
    console.log("El SERIVODR ESTA CORRIENDO EN PUERTO 8000");
})
