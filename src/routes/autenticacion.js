const express = require('express');
const router= express.Router();
const passport  = require('passport');

//y este metodo lo voy a ejecutar en cualquier ruta que quiera proteger
//const {isLoggedIn} = require('../lib/auth');


router.get('/signup',  (req,res)=>{
    res.render('auth/signup.hbs');
});


router.post('/signup', passport.authenticate('local.signup', {
  //aqui le estamo diciendo a donde quiere que valla
    //si sale tood bien
    successRedirect: '/profile',
    //AQUI decimos a donde queremos que valla el usuario.. cuando todo falle
    failureRedirect:'/signup',
    //mensaje de muestra cuando todo falle
    failureFlash:true,
}));

router.get('/signin', (req,res)=>{
    res.render('auth/signin.hbs');
});
///ruta para ingresar datos al signin
router.post('/signin', (req, res, next)=>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
      })(req, res, next);
});


var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/signin');
  }

//de esta forma con isLoggeIn protegemos la ruta
router.get('/profile',  isAuthenticated,(req,res)=>{
    res.render('profile.hbs');
    
});







  router.get("/logout", (req, res, next) => {
    req.logOut(req.user, err => {
        if(err) return next(err);
        res.redirect("/signin");  
    });
});


module.exports= router;