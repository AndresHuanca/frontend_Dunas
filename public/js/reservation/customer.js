const miFormulario = document.querySelector('#reservaForm');
const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/auth/' : 'https://backend-nodejs-postgresql.up.railway.app/api/auth/';
const urlAdmin = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/usuarios/' : 'https://backend-nodejs-postgresql.up.railway.app/api/usuarios/';
const urlReserva = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/productos_x_carritos/' : 'https://backend-nodejs-postgresql.up.railway.app/api/productos_x_carritos/';
const urlUuid_carrito = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/carritos/one/' : 'https://backend-nodejs-postgresql.up.railway.app/api/carritos/one/';

const urlMostrarReserva = (window.location.hostname.includes('localhost'))
                          ? 'http://localhost:8080/api/productos_x_carritos/' 
                          : 'https://backend-nodejs-postgresql.up.railway.app/api/productos_x_carritos/';



let usuario = null;
let nombre = "";
let dni = "";
let inicioReserva = null;
let salidaReserva = null;
let tipoh1 = "";
let tipoh2 = "";
let tipoh3 = "";
let total = 0;

const validarJWT = async() => {
  const token1 = localStorage.getItem('token') || '';
  const resp = await fetch(url, {
    headers: {
      'x-token': token1
    }
  });
  if (resp.status >= 300) {
    window.location = '../../index.html';
    console.log(token1);
    throw new Error('Token no válido');
  }
  const { usuario: userDb, token: tokenDb } = await resp.json();
  localStorage.setItem('token', tokenDb);
  usuario = userDb;
  document.title = usuario.nombre;
  getUuid(userDb);

  getReserva(userDb);
};

const calcularPrecio = () => {
  var precioMatrimonial = 45;
  var precioDoble = 60;
  var precioPersonal = 35;

  var cantidadMatrimonial = parseInt(document.getElementById('matrimonial').value) || 0;
  var cantidadDoble = parseInt(document.getElementById('doble').value) || 0;
  var cantidadPersonal = parseInt(document.getElementById('personal').value) || 0;

  inicioReserva = new Date(document.getElementById('inicioReserva').value);
  salidaReserva = new Date(document.getElementById('salidaReserva').value);

  nombre = document.getElementById('nombre').value || '';
  dni = document.getElementById('dni').value || '';

  var diasReserva = (salidaReserva - inicioReserva) / (1000 * 60 * 60 * 24);
  
  tipoh1 = "";
  tipoh2 = "";
  tipoh3 = "";

  if (cantidadMatrimonial > 0) {
    tipoh1 = "Matrimonial";
  }

  if (cantidadDoble > 0) {
    tipoh2 = "Doble";
  }

  if (cantidadPersonal > 0) {
    tipoh3 = "Personal";
  }

  if (isNaN(diasReserva) || diasReserva <= 0) {
    total = 0;
    document.getElementById('totalPrecio').textContent = 'S/0.00';
  } else {
    total = (precioMatrimonial * cantidadMatrimonial + precioDoble * cantidadDoble + precioPersonal * cantidadPersonal) * diasReserva;
    document.getElementById('totalPrecio').textContent = 'S/' + total.toFixed(2);
  }
};

document.getElementById('matrimonial').addEventListener('input', calcularPrecio);
document.getElementById('doble').addEventListener('input', calcularPrecio);
document.getElementById('personal').addEventListener('input', calcularPrecio);
document.getElementById('inicioReserva').addEventListener('input', calcularPrecio);
document.getElementById('salidaReserva').addEventListener('input', calcularPrecio);

const getUuid = async (user) => {
  try {
    const resp = await fetch(urlUuid_carrito + `${user.id_usuario}`);
    const { carrito } = await resp.json();
    // console.log(carrito.id_carrito);
    // console.log(`${user.nombre} + ${user.apellido}`);
    miFormulario.addEventListener('submit', event => {
      event.preventDefault();

      const formattedInicioReserva = inicioReserva.toISOString().split('T')[0];
      const formattedSalidaReserva = salidaReserva.toISOString().split('T')[0];




      const formData = {
        nombre: nombre,
        dni: dni,
        fecha_inicio: formattedInicioReserva,
        fecha_fin: formattedSalidaReserva,
        tipoh1: tipoh1,
        tipoh2: tipoh2,
        tipoh3: tipoh3,
        subtotal: total,
        estado: 'En Proceso',
        id_carrito: carrito.id_carrito
      };

      console.log(formData)
      fetch(urlReserva, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-type': 'application/JSON'
          },
        })
        .then(resp => resp.json())
        .then(({ errors, msg }) => {
          if (errors) {
            return console.error(errors);
          }
          if (msg) {
            return console.error(msg);
          }
          alert("Reserva Procesada");
        })
        .catch(err => {
          console.log(err);
        });
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

const getReserva = async (user) => {
  
  const resp = await fetch(urlUuid_carrito + `${user.id_usuario}`);
  const { carrito } = await resp.json();
  console.log(carrito.id_carrito);

  const resp01 = await fetch(urlMostrarReserva + `${carrito.id_carrito}`);
  const {productos_x_carritos} = await resp01.json();
  
  mostraReserva(productos_x_carritos);
  
  
}

const mostraReserva = (value=[]) => {
  let messageReserva = '';
  let nombre =[];
  let dni =[];
  let estado =[];
  let fecha_fin =[];
  let fecha_inicio=[];
  let subtotal=[];
  let tipoh1=[];
  let tipoh2=[];
  let tipoh3=[]; 
 
  for (let index = 0; index < value.length; index++) {
    nombre = value[index].nombre;
    dni = value[index].dni;
    estado = value[index].estado;
    fecha_fin = value[index].fecha_fin;
    fecha_inicio = value[index].fecha_inicio;
    subtotal = value[index].subtotal;
    tipoh1 = value[index].tipoh1;
    tipoh2 = value[index].tipoh2;
    tipoh3 = value[index].tipoh3;
    messageReserva += `
    <div class="container d-flex justify-content-center">
    <div class="card w-100">
      <div class="card-body">
        <div class="card">
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>Hospedado</th>
                  <th>DNI</th>
                  <th>Inicio</th>
                  <th>Salida</th>
                  <th>Tipo de Habitación </th>
                  <th>Tipo de Habitación </th>
                  <th>Tipo de Habitación </th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${nombre}</td>
                  <td>${dni}</td>
                  <td>${fecha_inicio}</td>
                  <td>${fecha_fin}</td>
                  <td>${tipoh1}</td>
                  <td>${tipoh2}</td>
                  <td>${tipoh3}</td>
                  <td>S/${subtotal}</td>
                <td><span class="confirmado">${estado}</span></td>
                </tr>
                <!-- Agrega más filas según sea necesario -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
    `
    document.getElementById('showUser').innerHTML = messageReserva;


  }

}

const main = async () => {
  await validarJWT();
};

main();
