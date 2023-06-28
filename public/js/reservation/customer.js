
// variables of form
const  miFormulario = document.querySelector('#reservaForm');

// validarJWT url para local y produccion 
const url = ( window.location.hostname.includes('localhost') )
        ? 'http://localhost:8080/api/auth/'
        : 'https://backend-nodejs-postgresql.up.railway.app/api/auth/';

// validarAdmin url para local y produccion 
const urlAdmin = ( window.location.hostname.includes('localhost') )
        ? 'http://localhost:8080/api/usuarios/'
        : 'https://backend-nodejs-postgresql.up.railway.app/api/usuarios/';

// Post reserva
// validarAdmin url para local y produccion 
const urlReserva = ( window.location.hostname.includes('localhost') )
        ? 'http://localhost:8080/api/productos_x_carritos/'
        : 'https://backend-nodejs-postgresql.up.railway.app/api/productos_x_carritos/';


const urlUuid = ( window.location.hostname.includes('localhost') )
        ? 'http://localhost:8080/api/carritos/get/'
        : 'https://backend-nodejs-postgresql.up.railway.app/api/productos_x_carritos/';


let usuario = null;


// Validar el token del localStorage
const validarJWT = async() => {
    // extrayendo token
    const token1 = localStorage.getItem('token' || '' );

    // Url of production or  developer
    // Extraigo en token del backen de la route auth/
    const resp = await fetch( url, { 
        headers: { 'x-token': token1 }
    });

    // Validación de estancia en los html
    if( resp.status >= 300 ){
        window.location = '../../index.html';
        console.log(token1);
        throw new Error('Token no valido');
    }    

    //Obtengo toda la información del route y controller auth 
    // const datosUserAuth = await resp.json();
    // console.log(datosUserAuth);

    const { usuario: userDb, token: tokenDb } = await resp.json();
    // establezco el nuevo JWT 
    localStorage.setItem( 'token', tokenDb );
    // Save information of user
    usuario = userDb;
    // Title in page
    document.title = usuario.nombre;
    
    getUuid(userDb);

}

// Obtener la fecha actual
var today = new Date().toISOString().split('T')[0];

// Establecer la fecha mínima para los campos de fecha
document.getElementById('inicioReserva').setAttribute('min', today);
document.getElementById('salidaReserva').setAttribute('min', today);

// calculo automatico 
function calcularPrecio() {
    var precioMatrimonial = 45;
    var precioDoble = 60;
    var precioPersonal = 35;
  
    var cantidadMatrimonial = parseInt(document.getElementById('matrimonial').value) || 0;
    var cantidadDoble = parseInt(document.getElementById('doble').value) || 0;
    var cantidadPersonal = parseInt(document.getElementById('personal').value) || 0;
  
    var inicioReserva = new Date(document.getElementById('inicioReserva').value);
    var salidaReserva = new Date(document.getElementById('salidaReserva').value);
  
    var diasReserva = (salidaReserva - inicioReserva) / (1000 * 60 * 60 * 24);
  
    if (isNaN(diasReserva) || diasReserva <= 0) {
      document.getElementById('totalPrecio').textContent = 'S/0.00';
    } else {
      var total = (precioMatrimonial * cantidadMatrimonial + precioDoble * cantidadDoble + precioPersonal * cantidadPersonal) * diasReserva;
      document.getElementById('totalPrecio').textContent = 'S/' + total.toFixed(2);
    }
  }
  
  // Actualizar el total del precio al cambiar los valores
  document.getElementById('matrimonial').addEventListener('input', calcularPrecio);
  document.getElementById('doble').addEventListener('input', calcularPrecio);
  document.getElementById('personal').addEventListener('input', calcularPrecio);
  document.getElementById('inicioReserva').addEventListener('input', calcularPrecio);
  document.getElementById('salidaReserva').addEventListener('input', calcularPrecio);
  
// calculo automatico 

// POST
miFormulario.addEventListener('submit', event => {
    event.preventDefault();
  
    const formData = new FormData(miFormulario);
    const fileInput = document.getElementById('myFile');
    const file = fileInput.files[0];
    formData.append('image', file);
  
    fetch(urlReserva, {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(resp => resp.json())
    .then(({ errors, token, msg }) => {
      console.log(errors);
  
      if (errors) {
        displayAlert(errors);
        return console.error(errors);
      }
      if (msg) {
        displayAlert(msg);
        console.log(errors);
        return console.error(msg);
      }
  
      localStorage.setItem('token', token);
      window.location = './views/start/principal.html';
    })
    .catch(err => {
      console.log(err);
    });
  });
  
    
    // Validación de existencia de email y password
    function displayAlert(value) {
        let  message = '';

                message = `
                    <div class="alert alert-danger" role="alert">
                        <div class="text-center ">
                            ${value}
                        </div>
                    </div> 
                    `;
                document.getElementById('messageError').innerHTML = message;
        
            console.log(value);  
    
    }

// POST

// UUIPRODUCTOS-CARRITO
const getUuid = async(user) => {

    const resp = await fetch( urlUuid, { 
    });
    console.log(user.id_usuario)
    //Obtengo toda la información del route y controller auth 
    const  {usuario}  = await resp.json();
    console.log(usuario)
}

// UUID


const main = async() => {
// Validar JWT
await validarJWT();

};

main();

// export 

