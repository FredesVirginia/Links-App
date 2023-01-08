///aqui vamos a definir los metodos de autotenficacion

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
 const pool=require('../database');
 const  helpers = require('../lib/helpers');


 //nuestra autentificacion se llama local.signup
passport.use('local.signup' , new LocalStrategy({
    //aqui le estamos diciendo de que campo del form vamos a recibir la informacion
    //en cada imput hay una atributo llamado name.. lo que va ahi..
    //lo ponemos aqui
    //entonces el userNmaeFiel.. lo estamos recibiendo del campo username
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback:true
},  
 // aqui estamos definiendo que es lo que a sucedr luego de que el usuario
 //se autentique.. es un calback
 //el don se va a utilizar luego de que termine nuestro proceso de autentificacion
 //por ejemplo si queremos guardar algun enlace y demas.
async(req, username,password,done)=>{
    const  {fullname}= req.body;
    const newUser={
        username,
        password,
        fullname

    };

    //aqui estamos guardando la contraseña en texto plano y no deberia ser asi
    // por eso creamo el archivos helpers.js
    //aqui estamos cifrando la clave
    newUser.password= await helpers.encryptPassword(password);
     const result = await pool.query('INSERT INTO users SET ?', [newUser]);
     //aqui.. va a ser null si hay un error
     //o va a guardar newuser en una sesion
     //luego en newUser.id... le estamos agregamdo un id.. cuyo calor sera
     // una propierdad de result
     newUser.id= result.insertId;
    return done(null, newUser);
       
}));


passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Welcome ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The Username does not exists.'));
  }
}));

//aqui se va a guardar al usuario en una sesion
passport.serializeUser((user, done) =>{
    //aqui envamos un null si hay un error.. sino el id de user
    done(null, user.id)
});
// aqui vamos a necesitar el id, y el done
passport.deserializeUser( async (id, done) =>{
    //filas va a retornar un areglo
  const filas = await pool.query('SELECT * FROM  users WHERE id = ?' , [id]);
  done(null, filas[0]);
}

);
