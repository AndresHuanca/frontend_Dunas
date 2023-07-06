const miFormulario = document.querySelector('#reservaForm');
const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/auth/' : 'https://backend-nodejs-postgresql.up.railway.app/api/auth/';
const urlAdmin = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/usuarios/' : 'https://backend-nodejs-postgresql.up.railway.app/api/usuarios/';
const urlReserva = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/productos_x_carritos/' : 'https://backend-nodejs-postgresql.up.railway.app/api/productos_x_carritos/';
const urlUuid_carrito = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/carritos/one/' : 'https://backend-nodejs-postgresql.up.railway.app/api/carritos/one/';

const urlMostrarReserva = (window.location.hostname.includes('localhost'))
                          ? 'http://localhost:8080/api/carritos/' 
                          : 'https://backend-nodejs-postgresql.up.railway.app/api/carritos/';



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

  getReserva(userDb);
};

const getReserva = async (user) => {
  
  const resp = await fetch(urlUuid_carrito + `${user.id_usuario}`);
  const { carrito } = await resp.json();

  const resp01 = await fetch(urlMostrarReserva );
  const { carritos } = await resp01.json();
 console.log(carritos)
 carritos.forEach((arreglo) => {
  // Verificar si el arreglo actual es el segundo arreglo
  if (arreglo === carritos[1]) {
    arreglo.forEach((valor) => {
      // Aquí puedes acceder a cada valor dentro del segundo arreglo
      console.log(valor);
    });
  }
});






  mostraReserva(carritos);
  
  
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
