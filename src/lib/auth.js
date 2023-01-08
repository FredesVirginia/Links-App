//este objeto nos va a decir si el usuario esta logeado o no
const express = require('express');
const router= express.Router();
module.exports={
    //ponemos req, res ,y next.. porque lo usaremos en la rutas
    isLoggedIn(req,res,next){
        //este metodo me va a devolver true o false.. si el usario existe o no 
       if(req.isAuthenticated()){
        
       return next();
      }
       return res.redirect('/signin');
      }
};
