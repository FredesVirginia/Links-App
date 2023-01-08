const express = require('express');
const router= express.Router();

const pool = require('../database');



var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/signin');
  }

router.get('/add', isAuthenticated, (req,res)=>{
    //aqui vamos a rendedizarlo a la pagina para agregar un nuevo link
    res.render('links/add.hbs');
});

///esta sera la ruta en donde se envien los formularios
router.post('/add', isAuthenticated,  async (req, res)=>{
    const { title, url, description} =req.body;
    const newLink={
        title,
        url,
        description,
        user_id : req.user.id
    };

    //esta es una peticion a la basa de datos, es  una peticion asincrona
    //de aho que usamos away.. entonces cuando termine con esta peticion.. continuara
    //con la siguiente linea.. y para que funione await.. la funcion principal
    //debe terer la palabra reservada asing
     await pool.query("INSERT INTO link set  ?" , [newLink]);
     ///AL UTILIZAR MODEWALER.. LO TENEMOS DISPONIBLES A TRA VEZ DE REQ
    
     //luego quiero mostrarlo en todas mis vistas. para hacerlo tengo que hacerlo 
     //disponible
     req.flash('success', 'LINK OKI');
    res.redirect('/links' );
});

router.get('/' , isAuthenticated,  async (req,res)=>{
   const links= await pool.query("SELECT * FROM link WHERE user_id= ?" ,[req.user.id]);
   console.log(links);
   res.render('links/list.hbs', {links});
});

router.get('/delete/:id',isAuthenticated,  async (req,res)=>{
    const id = req.params.id;
    await pool.query('DELETE FROM link WHERE ID =?', [id]);
    
    res.redirect('/links');
});

router.get('/edit/:id', isAuthenticated,  async (req,res)=>{
    const id= req.params.id;
  const links = await  pool.query('SELECT * FROM link WHERE id = ?', [id]);
  console.log(links[0]);
    res.render('links/edit.hbs', {links:links[0]} );
});

router.post('/edit/:id', isAuthenticated,  async(req, res)=>{
    const id= req.params.id;
    const {title, description, url} = req.body;

    const newLink={
        title,
        description,
        url
    };
   await  pool.query('UPDATE link set  ? WHERE id = ? ', [newLink, id]);
    res.redirect('/links');

});

module.exports= router;