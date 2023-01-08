const mysql = require('mysql');
//este es para soportar las promersas
const { promisify } = require('util');
 const { database }=require('./keys.js');

 //creado conexion con bbdd
const pool= mysql.createPool(database);

pool.getConnection((err,connection)=>{
  if(err){
    if(err.code==='PROTOCOL_CONNECTION_LOST'){
        console.error('ERROR DE CONCECION.. SE CERRO');
    }
    if(err.code==='ER_CON_COUNT_ERROR'){
        console.error('base de datos tiene many connection');
    }
    if(err.code==='ECONNREFUSED'){
        console.error('Conecion rechasada')
  }
}

if(connection) connection.release();
console.log("Conexion CORRECTA");
 return;
});

//promesas.. Aqui estoy pasado a promersas.. lo que era un callback
pool.query=promisify(pool.query)

module.exports = pool;