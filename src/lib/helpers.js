//// este un archivo que servira para cifrar los datos.. o para procesar determinados
//datos de la aplicacion
const bcript = require('bcryptjs');



const helpers={

};

//este metodo es para cifrar nuestra constraseña
//aqui el password que recibe es la clave que ponemos desde el forumulario 
// de sigup.. desde el front
helpers.encryptPassword=  async(passsword)=>{
// con esto vamos a generar un hash
// y se va a ejercutar 10.. a veces.. mas seguro sera el cifrado.. pero tomara mas tiempo
//esto va a tomar algo de tiempo de aho que usamos await
//aqui generamos un patron. esto es necesario para cifrar la contraseña
 const salt = await bcript.genSalt(10);
 // y con esto va a cifrar la contraseña, se le encia el patron y la cnotraseño desde el front
const hash= await bcript.hash(passsword, salt);
  return hash;
};

//ñuego ... cuando el usuario quiere entrar de nuevo a su seccion
//debemos compara la clave que el esta poniendo con la que tenemos guardad en la base de datos

helpers.matchPassword = async (password, savePassword)=>{
    //este metodo compara dos string
    // en este caso las claves
    try {
      return  await bcript.compare(password, savePassword); 
    } catch (error) {
        cosole.log(error);
    }
    
};
module.exports= helpers;